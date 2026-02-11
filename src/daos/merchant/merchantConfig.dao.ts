import crypto from "crypto";
import { MerchantConfig } from "../../models/merchantConfig.model"; // Adjust path

export const createMerchantConfigDAO = async (
  merchantId: string,
  monitoringAddress: string,
  webhookUrl: string,
) => {

  const apiKey = `ak_live_${crypto.randomBytes(16).toString("hex")}`;
  const webhookSecret = `whsec_${crypto.randomBytes(16).toString("hex")}`;

  await MerchantConfig.create({
    merchantId,
    monitoringAddress,
    webhookUrl,
    webhookSecret,
    apiKey,
    isActive: true,
  });

  return true;
};

export const updateMerchantConfigDAO = async (
  merchantId: string,
  updateData: object,
) => {
  return await MerchantConfig.findOneAndUpdate(
    { merchantId },
    { $set: updateData },
    { new: true, runValidators: true },
  );
};

export const getMerchantByApiKey = async (apiKey: string) => {
  return await MerchantConfig.findOne({ apiKey }).lean();
}

export const getMerchantByMerchantId = async (merchantId: string) => {
  return await MerchantConfig.findOne({merchantId}).lean();
}