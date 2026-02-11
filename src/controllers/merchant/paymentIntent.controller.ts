import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError.utils";
import { ApiResponse } from "../../utils/apiResponse.utils";
import { getTokensByChainId } from '../../daos/blockchain.dao';
import { INR_PER_USD } from '../../constants/envConstants';
import { checkSingleSubscription } from '../../daos/merchant/merchantSubsciption.dao';
import { createPaymentIntentDao, findActivePendingIntentDao } from '../../daos/merchant/paymentIntent.dao';
import { setQuickNodeKV } from '../../service/quicknode.kvservice';
import { getMerchantByMerchantId } from "./../../daos/merchant/merchantConfig.dao";
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from "../../utils/asyncHandler.utils";

export const createPaymentIntent = asyncHandler( async (req: Request, res: Response) => {
    const { amountInInr, tokenSymbol , chainId } = req.body;
    const merchantId = (req as any).merchant;
    const chainData = await getTokensByChainId(chainId);
    
    if(!chainData){
        throw new ApiError("No tokens found", 400);
    }
    const selectedToken = chainData.tokens.find(
        (t) => t.tokenSymbol === tokenSymbol
    );

    if (!selectedToken) {
        throw new ApiError("Token not found on this chain", 400);
    }
    
    // check if merchant subscribed to the token or not
    const subscription = await checkSingleSubscription(
        merchantId, 
        chainId, 
        selectedToken.contractAddress.toLowerCase()
    );

    if (!subscription) {
        throw new ApiError("Merchant is not subscribed to this token", 403);
    }

    let finalUsdAmount = Number((amountInInr / Number(INR_PER_USD)).toFixed(2));

    let isUnique = false;
    while (!isUnique) {
        // Check for any PENDING intent with this exact USD amount
        const existingIntent = await findActivePendingIntentDao(
        merchantId,
        tokenSymbol,
        finalUsdAmount
    );

        if (existingIntent) {
            // Increase by 0.01 and round to 2 decimals to avoid floating point errors
            finalUsdAmount = Number((finalUsdAmount + 0.01).toFixed(2));
        } else {
            isUnique = true;
        }
    }

    const merchant = await getMerchantByMerchantId(merchantId);

    const intentId = uuidv4();
    const onChainAmountRaw = Math.round(finalUsdAmount * 1_000_000).toString();
    await setQuickNodeKV(merchant!.monitoringAddress, onChainAmountRaw, intentId);

// 3. Save to DB using the DAO
    const intent = await createPaymentIntentDao(
        merchantId,
        intentId,
        tokenSymbol,
        selectedToken.contractAddress,
        amountInInr,
        finalUsdAmount,    // amountInUsd
        onChainAmountRaw,    // exactTokenAmount (assuming 1:1 stablecoin)
        chainId
    );

    return new ApiResponse(200, intent, `Please pay exactly $${finalUsdAmount.toFixed(2)} ${tokenSymbol}`);

});

    
