import "reflect-metadata"
import express from "express";
import { createConnection } from "typeorm";
import { Campground } from "./entities/Campground";

const main = async () => {
  const app = express();

  try {
    const conn = await createConnection({
      type: "postgres",
      database: "trip-in-crete",
      username: "postgres",
      password: "postgres",
      // logging: true,
      synchronize: true,
      entities: [Campground],
      // migrations: ['./migrations/**/*.[tj]s']
    });

    if (conn.isConnected) {
      console.log("DB connection success: ", conn.isConnected)
    }
  }
  catch (err) {
    console.log("Error while connecting to db", err)
  }

  app.get("/", (_, res) => {
    res.send("HELLO WORLD");
  });

  app.listen(3000, () => {
    console.log("Server listening on PORT 3000");
  });
};

main();
