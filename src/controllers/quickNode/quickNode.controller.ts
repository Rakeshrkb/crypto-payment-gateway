import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import { ApiResponse } from "../../utils/apiResponse.utils";
import { PaymentIntent } from "../../models/paymentIntent.model";
import { webhookQueue } from "../../queues/webhook.queue";
import { getMerchantByMerchantId } from '../../daos/merchant/merchantConfig.dao';

export const validateIntentThroughQuickNode = asyncHandler(async (req: Request, res: Response) => {
    // QuickNode sends the array returned by the 'main' function as the request body
    const events = req.body;

    console.log("QuickNode Webhook Received Payload:", JSON.stringify(events, null, 2));

    if (!Array.isArray(events) || events.length === 0) {
        console.log("No matched events in this payload.");
        return new ApiResponse(200, {}, "No events to process");
    }

    for (const event of events) {
        const { intentId, txHash, merchantAddress, amount } = event;

        if (!intentId) continue;

        // 1. Find the pending intent and update it
        const updatedIntent = await PaymentIntent.findOneAndUpdate(
            { 
                intentId: intentId, 
                status: 'PENDING' // Only update if it's still pending
            },
            { 
                status: 'SUCCESS',
                transactionHash: txHash,
                paidAt: new Date()
            },
            { new: true }
        );

        
        if (updatedIntent) {
            console.log(`✅ Payment Confirmed! Intent: ${intentId} | TX: ${txHash}`);
            const merchant = await getMerchantByMerchantId(updatedIntent!.merchantId.toString());
            await webhookQueue.add('notify-merchant',{
                compositeKey: updatedIntent.quicknodeKey,
                payload: {
                merchantSecret: merchant!.webhookSecret,
                amount: event.value,
                webHookUrl: merchant?.webhookUrl,
                txHash: event.transactionHash,
                intentId: updatedIntent.intentId 
            }
            },{
            attempts: 5,
            backoff: { type: 'exponential', delay: 1000 }
        })
            // TODO: Notify your frontend via Socket.io or Webhook to the Merchant's server
        } else {
            console.log(`⚠️ Received match for Intent ${intentId}, but it was already processed or not found.`);
        }
    }

    

    return new ApiResponse(200, {}, "Events processed successfully");
});

    //   if (isMatch) {
    //     matchedEvents.push({
    //       txHash: log.transactionHash,
    //       to: toAddress,
    //       amount: amount,
    //       contract: log.address, // USDC or USDT contract address
    //       block: log.blockNumber
    //     });

export const testQueueAndWorkers = asyncHandler(async(req: Request, res: Response)  => {
    const { url, compositeKey, payload } = req.body;
               await webhookQueue.add('merchant-webhooks',{
                url,
                payload,
                compositeKey
            },{
            attempts: 5,
            backoff: { type: 'exponential', delay: 1000 }
        })

    console.log("job added to bull mq");
    return new ApiResponse(200, {}, "Events processed successfully");
});