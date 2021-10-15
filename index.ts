import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("HOME ROUTE");
});

app.listen(3001, () => {
  console.log("Server listening on PORT 3001");
});
