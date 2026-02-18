import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
