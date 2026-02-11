import mongoose, { Schema, Document } from "mongoose";

export interface IBlockchain extends Document {
  name: string;
  chainId: number;
  symbol: string;
  imageUrl?: string;
  network: string;
  rpcUrl: string;
}

const blockchainSchema = new Schema<IBlockchain>(
  {
    name: { type: String, required: true },
    chainId: { type: Number, required: true, unique: true },
    symbol: { type: String, required: true },
    imageUrl: { type: String, required: false },
    network: { type: String, required: true },
    rpcUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const BlockchainSchema = mongoose.model<IBlockchain>("Blockchain", blockchainSchema);