import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { QueryFailedError, SimpleConsoleLogger } from "typeorm";
import { MyContext } from "../types";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class ForgotPasswordResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}

// NOTE: instead of passing Args separately
@InputType()
class RegisterInput {
  @Field()
  name!: string;

  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field()
  email!: string;
}

@InputType()
class LoginInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

const queryFailedGuard = (
  err: any
): err is QueryFailedError & { code: string } & { detail: string } =>
  err instanceof QueryFailedError;

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // if the current user is requesting we can show them their email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // otherwise we show empty
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redis }: MyContext
  ): // NOTE: makes sure we are typing correctly
  Promise<UserResponse> {
    if (newPassword.length < 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Password length must be at least 8 characters",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token has expired",
          },
        ],
      };
    }

    const user = await User.findOne(parseInt(userId));

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    await user.save();
    // OR User.update({id: parseInt(userId)}, {password: await argon2.hash(newPassword)})

    redis.del(key);

    // login user after password change
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    if (email.length < 1) {
      return {
        errors: [
          {
            field: "email",
            message: "Email cannot be empty",
          },
        ],
      };
    }

    const user = await User.findOne({ email: email });
    // OR const user = await User.findOne({where: {  email }});
    if (!user) {
      // not informing user for security
      return { success: true };
    }

    const token = v4();
    // token is good for 3 days
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await sendEmail(
      email,
      "Password Change Request",
      // TODO: switch domain
      `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">Reset Password</a>`
    );

    return { success: true };
  }

  @Mutation(() => Boolean)
  async acceptUser(
    @Arg("username") username: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    if (!req.session.userId) {
      return false;
    }

    const user = await User.findOne(req.session.userId);

    console.log("username: ", username);

    if (!user?.isAdmin) {
      return false;
    }

    const userToAccept = await User.findOne({ username: username });
    console.log("---------");
    console.log(userToAccept);

    if (!userToAccept) {
      return false;
    }

    console.log("=======");
    console.log(userToAccept);

    if (userToAccept.isAccepted) {
      return false;
    }

    userToAccept.isAccepted = true;
    userToAccept.save();
    console.log("returning");
    return true;
  }

  @Query(() => [User], { nullable: true })
  async users(@Ctx() { req }: MyContext): Promise<User[] | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne(req.session.userId);

    if (!user?.isAdmin) {
      return null;
    }

    const pendingUsers = await User.find({});
    console.log(pendingUsers);
    return pendingUsers;
  }

  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    // TODO: add validation library for advanced checks
    if (options.username.length < 6) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be at least 6 characters",
          },
        ],
      };
    }

    if (options.password.length < 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be at least 8 characters",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    try {
      const user = await User.create({
        username: options.username,
        name: options.name,
        email: options.email,
        password: hashedPassword,
      }).save();

      // NOTE: store userId in session to keep them
      // logged in
      req.session.userId = user.id;

      return { user };
    } catch (err: unknown) {
      if (queryFailedGuard(err)) {
        // FIX: check for correct error code, when other properties are same
        if (err.code === "23505" || err.detail.includes("already exists")) {
          return {
            errors: [
              {
                field: "username",
                message: `${options.username} is already in use`,
              },
            ],
          };
        }
      }
      console.log(err);
      return {
        errors: [
          {
            field: "username",
            message: "Something went wrong",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `${options.username} doesn't exist`,
          },
        ],
      };
    }

    const isValidPassword = await argon2.verify(
      user.password,
      options.password
    );

    if (!isValidPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid credentials",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
