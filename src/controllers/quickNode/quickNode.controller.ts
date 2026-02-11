import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import { ApiResponse } from "../../utils/apiResponse.utils";
import { PaymentIntent } from "../../models/paymentIntent.model";

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