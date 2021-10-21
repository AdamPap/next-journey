import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { QueryFailedError } from "typeorm";
import { MyContext } from "../types";

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

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput
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

    if (options.password.length < 8) {
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

      return { user };
    } catch (err: unknown) {
      if (queryFailedGuard(err)) {
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
}
