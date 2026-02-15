import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./constants/connectDb";
import { gracefulShutDown } from "./configs/server.config";
import { ErrorHandler } from "./middlewares/errorHandler";
import mainRouter from "./routes/index";
import { initWebHookWorker } from "./workers/webHook.worker";
import { initWebHookQueue } from "./queues/webhook.queue";

dotenv.config();
const app = express();
app.use(express.json());
let workerInstance: any;
let queueInstance: any;

const startServer = async () => {
  try {
    await connectDB();
    queueInstance = await initWebHookQueue();
    workerInstance = await initWebHookWorker();

    app.use("/api/", mainRouter);

    app.get("/", (_req, res) => {
      res.send("TS backend running 🚀");
    });
    app.use(ErrorHandler);
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server sequence:", error);
    process.exit(1);
  }
};

process.on("SIGINT",()=> gracefulShutDown(queueInstance,workerInstance));
startServer();