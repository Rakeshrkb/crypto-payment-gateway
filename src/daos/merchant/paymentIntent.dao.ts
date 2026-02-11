import { PaymentIntent, PaymentStatus } from "../../models/paymentIntent.model";

export const createPaymentIntentDao = async (
  merchantId: string,
  intentId: string,
  tokenSymbol: string,
  tokenAddress: string,
  amountInr: number,
  amountInUsd: number,
  exactTokenAmount: string,
  chainId: number
) => {
  return await PaymentIntent.create({
    merchantId,
    intentId,
    tokenSymbol,
    tokenAddress,
    amountInr,
    amountInUsd,
    exactTokenAmount,
    chainId,
    // Setting expiry to 15 minutes from now
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
};



export const findActivePendingIntentDao = async (
  merchantId: string,
  tokenSymbol: string,
  amountInUsd: number
) => {
  return await PaymentIntent.findOne({
    merchantId,
    tokenSymbol,
    amountInUsd,
    status: PaymentStatus.PENDING,
    // Ensure we only find intents that haven't expired yet
    expiresAt: { $gt: new Date() }
  }).lean(); // Use lean for a faster read-only check
};