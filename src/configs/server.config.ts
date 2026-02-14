import mongoose from 'mongoose';

export const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const gracefulShutDown = async (queueInstance: any,workerInstance: any ) => {
   console.log("\n👋 Stopping server...");
   if(queueInstance){
    await queueInstance.close();
    console.log("Queue Instance Closed");
   }

   if(workerInstance){
    await workerInstance.close();
    console.log("Worker Instance Closed");
   }

    // 2. Close Database Connection
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed.");

  console.log("✅ Shutdown complete. Goodbye!");
  process.exit(0);
}