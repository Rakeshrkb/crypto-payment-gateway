import mongoose, { Schema, Document } from 'mongoose';

export interface IChainTokens extends Document {
  chainId: number; // This acts as your "Key"
  tokens: {
    tokenName: string;
    tokenSymbol: string;
    symbol: string;
    contractAddress: string;
    imageUrl?: string;
  }[]; // Array of tokens inside the chain entry
}

const chainTokensSchema = new Schema({
  chainId: { type: Number, required: true, unique: true },
  tokens: [
    {
      tokenName: String,
      tokenSymbol: String,
      symbol: String,
      contractAddress: String,
      imageUrl: String
    }
  ]
});

export const ChainTokens = mongoose.model<IChainTokens>('ChainTokens', chainTokensSchema);