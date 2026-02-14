import { required } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  EXPIRED = "EXPIRED"
}

export interface IPaymentIntent extends Document {
  merchantId: mongoose.Types.ObjectId;
  intentId: string,
  tokenSymbol: string;
  tokenAddress: string;
  amountInr: number;
  amountInUsd: number;
  exactTokenAmount: string; // The amount the user must actually send
  chainId: number;
  quicknodeKey: string;
  status: PaymentStatus;
  expiresAt: Date;
}

const paymentIntentSchema = new Schema<IPaymentIntent>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: "UserSchema", required: true },
    intentId: {type: String, required: true},
    tokenSymbol: { type: String, required: true },
    tokenAddress: { type: String, required: true, lowercase: true },
    amountInr: { type: Number, required: true },
    amountInUsd: { type: Number, required: true },
    exactTokenAmount: { type: String, required: true },
    chainId: { type: Number, required: true },
    quicknodeKey: {type: String, required: true},
    status: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING 
    },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Index for performance when checking existing amounts
paymentIntentSchema.index({ merchantId: 1, exactTokenAmount: 1, status: 1 });
// Optional: Auto-delete from DB after expiry
// paymentIntentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PaymentIntent = mongoose.model<IPaymentIntent>("PaymentIntent", paymentIntentSchema);