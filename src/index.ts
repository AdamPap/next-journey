import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { Campground } from "./entities/Campground";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { CampgroundResolver } from "./resolvers/campground";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "./constants";
import { MyContext } from "./types";

const main = async () => {
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // NOTE: before apollo so that it can be used by it
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
        httpOnly: true,
        secure: __prod__,
        sameSite: "none", //lax
      },
      secret: "justarandomsecret",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CampgroundResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    },
    // path: "/graphql",
  });

  // DATABASE
  try {
    const conn = await createConnection({
      type: "postgres",
      database: "trip-in-crete",
      username: "postgres",
      password: "postgres",
      // logging: true,
      //NOTE: just for dev, in prod -> migrations
      synchronize: true,
      entities: [Campground, User],
      // migrations: ['./migrations/**/*.[tj]s']
    });

    if (conn.isConnected) {
      console.log("DB connection success: ", conn.isConnected);
    }
  } catch (err) {
    console.log("Error while connecting to db", err);
  }

  app.get("/", (_, res) => {
    res.send("HELLO");
  });

  app.listen(3001, () => {
    console.log("Server listening on PORT 3001");
  });
};

main();
