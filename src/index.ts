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
      entities: [Campground]
    });

    if (conn.isConnected) {
      console.log("DB connection success: ", conn.isConnected)
    }
  }
  catch (err) {
    console.log("Error while connecting to db", err)
  }


  // const c1 = Campground.insert({ name: "Abyss" })
  // const c1 = await Campground.find()
  // console.log(c1)

  app.get("/", (req, res) => {
    res.send("HELLO WORLD");
  });

  app.listen(3000, () => {
    console.log("Server listening on PORT 3000");
  });
};

main();
