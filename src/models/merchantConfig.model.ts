import mongoose, { Schema, Document } from "mongoose";

export interface IMerchantConfig extends Document {
  merchantId: mongoose.Types.ObjectId; // Link to your User model
  monitoringAddress: string;           // The wallet address the business owns
  webhookUrl: string;                  // Where we send notifications
  webhookSecret: string;               // A secret key for them to verify our requests
  apiKey: string;                      // A key that helps to create intent
  isActive: boolean;                   // To pause all services at once
}

const merchantConfigSchema = new Schema<IMerchantConfig>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: "UserSchema", required: true, unique: true },
    monitoringAddress: { type: String, required: true, lowercase: true, trim: true },
    webhookUrl: { type: String, required: true, trim: true },
    webhookSecret: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MerchantConfig = mongoose.model<IMerchantConfig>("MerchantConfig", merchantConfigSchema);