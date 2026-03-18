import express from "express";
import dotenv from "dotenv";

dotenv.config();

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(express.json());

  app.use("/health", (_, res) => {
    res.send("OK");
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
