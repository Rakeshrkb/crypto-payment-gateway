import { Worker, Job } from "bullmq";
import axios from "axios";
import { connection } from "../../configs/server.config";
import { removeQuickNodeKey } from "../quicknode.kvservice";

export const initWebHookWorker = () => {
  const webHookWorker = new Worker(
    "merchant-webhooks",
    async (job: Job) => {
      const { url, payload, compositeKey } = job.data;
      console.log(
        `🚀 Attempting to notify merchant for Intent: ${payload.intentId}`,
      );

      try {
        await axios.post(url, payload, { timeout: 10000 });

        console.log(
          `✅ Merchant notified successfully for ${payload.intentId}`,
        );
        // 3. Cleanup: Remove the key from QuickNode KV now that delivery is confirmed
        await removeQuickNodeKey(compositeKey);
        console.log(`🗑️ QuickNode KV key ${compositeKey} removed.`);
      } catch (error: any) {
        // If the merchant's server is down (e.g., 500 or 404), we throw an error.
        // BullMQ catches this and will automatically retry the job based on your config.
        console.error(`❌ Failed to notify merchant: ${error.message}`);
        throw new Error(`Webhook delivery failed: ${error.message}`);
      }
    },
    {
      connection,
      // Ensure the worker is ready to retry
      settings: {
        backoffStrategy: (attempts: number) => {
          return Math.pow(2, attempts) * 1000; // Exponential backoff
        },
      },
    },
  );

  webHookWorker.on("ready", () => {
    console.log("✅ Webhook Worker: Registered and connected to Redis.");
  });

  return webHookWorker;
};
