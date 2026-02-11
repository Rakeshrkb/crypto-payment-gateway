import { Request, Response, NextFunction } from "express";
import { getMerchantByApiKey } from "../daos/merchant/merchantConfig.dao";
import { ApiError } from "../utils/apiError.utils";

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rawApiKey = req.headers["x-api-key"] as string;
  if (!rawApiKey) {
    throw new ApiError("x-api-key not found", 401);
  }
  
  const apiKey = Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey;
  const merchant = await getMerchantByApiKey(apiKey);

  if (!merchant) {
    throw new ApiError("Invalid API key", 403);
  }

  // Attach merchant data to req for the next middleware/route
  (req as any).merchant = merchant.merchantId;
  next();
};
