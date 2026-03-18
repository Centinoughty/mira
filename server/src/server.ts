import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.route";

dotenv.config();

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(
    cors({
      origin: [process.env.CLIENT_URL!],
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use("/health", (_, res) => {
    res.send("OK");
  });

  app.use("/auth", authRoutes);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
