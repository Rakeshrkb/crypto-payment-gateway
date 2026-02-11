import mongoose, { Document, Schema } from "mongoose";

export interface IMerchantSubscription extends Document {
  merchantId: mongoose.Types.ObjectId; // Ref to MerchantConfig
  chainId: number;
  tokenAddress: string;                // The contract address of the token
  tokenSymbol: string;
  isEnabled: boolean;
}

const merchantSubscriptionSchema = new Schema<IMerchantSubscription>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: "UserSchema", required: true },
    chainId: { type: Number, required: true },
    tokenAddress: { type: String, required: true, lowercase: true },
    tokenSymbol: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// This ensures a merchant can't subscribe to the same token on the same chain twice
merchantSubscriptionSchema.index({ merchantId: 1, chainId: 1, tokenAddress: 1 }, { unique: true });

export const MerchantSubscription = mongoose.model<IMerchantSubscription>("MerchantSubscription", merchantSubscriptionSchema);