import express from "express";
import { createConnection } from "typeorm";

const main = async () => {
  const app = express();

  const conn = await createConnection({
    type: "postgres",
    database: "trip-in-crete",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    // entities:
  });

  app.get("/", (req, res) => {
    res.send("HELLO WORLD");
  });

  app.listen(3001, () => {
    console.log("Server listening on PORT 3001");
  });
};

main();
