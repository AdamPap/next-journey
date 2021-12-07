import "reflect-metadata";
import "dotenv-safe/config";
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
import path from "path";
import { Upvote } from "./entities/Upvote";

const main = async () => {
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  // NGINX proxy
  app.set("proxy", 1);
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
        domain: __prod__ ? ".next-journey.xyz" : undefined,
      },
      secret: process.env.SESSION_SECRET,
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
      // origin: [process.env.CORS_GRAPHQL, process.env.CORS_ORIGIN],
      origin: [process.env.CORS_ORIGIN],
    },
    // path: "/graphql",
  });

  // DATABASE
  try {
    const conn = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      // logging: true,
      //NOTE: sync just for dev, in prod -> migrations
      synchronize: !__prod__,
      entities: [Campground, User, Upvote],
      migrations: [path.join(__dirname, "./migrations/*")],
    });

    if (conn.isConnected) {
      console.log("DB connection success: ", conn.isConnected);
      conn.runMigrations();
    }
  } catch (err) {
    console.log("Error while connecting to db", err);
  }

  app.get("/", (_, res) => {
    res.send("HELLO");
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`);
  });
};

main();
