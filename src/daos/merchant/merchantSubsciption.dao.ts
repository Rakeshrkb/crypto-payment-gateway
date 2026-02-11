import { MerchantSubscription } from "../../models/merchantSubscription.model";
import { getTokensByChainId } from "../blockchain.dao";
import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.utils";
import { Types } from "mongoose";


export const syncMerchantSubscriptions = async (
  merchantId: string,
  selections: { chainId: number; tokenAddresses: string[] }[]
) => {
  const session = await mongoose.startSession();
  let count = 0;

  await session.withTransaction(async () => {
    await MerchantSubscription.deleteMany({ merchantId }, { session });

    const finalSubscriptions = [];

    // 2. Map and Validate
    for (const { chainId, tokenAddresses } of selections) {
      const supportedChain = await getTokensByChainId(Number(chainId));
      
      if (!supportedChain) throw new ApiError(`Chain ID ${chainId} unsupported`, 400);

      for (const address of tokenAddresses) {
        const tokenMatch = supportedChain.tokens.find(
          (t: { contractAddress: string }) => t.contractAddress.toLowerCase() === address.toLowerCase()
        );

        if (!tokenMatch) throw new ApiError(`Token ${address} unsupported on chain ${chainId}`, 400);

        finalSubscriptions.push({
          merchantId,
          chainId,
          tokenAddress: tokenMatch.contractAddress.toLowerCase(),
          tokenSymbol: tokenMatch.symbol,
          isEnabled: true,
        });
      }
    }

    // 3. Bulk Insert
    if (finalSubscriptions.length > 0) {
      await MerchantSubscription.insertMany(finalSubscriptions, { session });
      count = finalSubscriptions.length;
    }
  });

  session.endSession();
  return { success: true, count };
};

export const getMerchantSubscriptionsById = async (merchantId: string) => {
  return await MerchantSubscription.find({ merchantId })
    .sort({ chainId: 1 })
    .lean();
};


export const checkSingleSubscription = async (merchantId: string, chainId: number, tokenAddress: string) => {
  const query = {
        merchantId: new Types.ObjectId(merchantId),
        chainId: Number(chainId),
        tokenAddress: tokenAddress.toLowerCase(),
        isEnabled: true
    };
    console.log("Subscription Query Object:", JSON.stringify(query));

    return await MerchantSubscription.findOne(query).lean();
};