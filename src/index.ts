import "reflect-metadata"
import express from "express";
import { createConnection } from "typeorm";
import { Campground } from "./entities/Campground";
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql";
import { CampgroundResolver } from "./resolvers/campground";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CampgroundResolver, UserResolver],
      validate: false
    }),
    // context: () => ({ req, res }) => ({ req, res })
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

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
      console.log("DB connection success: ", conn.isConnected)
    }
  }
  catch (err) {
    console.log("Error while connecting to db", err)
  }

  // const c1 = await Campground.insert({ name: "Kera", location: "Crete" })
  // const p1 = await Place.find()
  // console.log(p1)

  app.listen(3000, () => {
    console.log("Server listening on PORT 3000");
  });
};

main();
