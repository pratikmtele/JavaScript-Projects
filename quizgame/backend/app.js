import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import express from "express";
import connectDB from "./db/config.js";
import router from "./routes/quiz.route.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.send("API working!");
});

app.use("/api", router);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on the http://localhost:${PORT}`);
  });
});
