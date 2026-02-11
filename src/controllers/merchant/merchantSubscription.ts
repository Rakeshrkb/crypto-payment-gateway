import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/apiResponse.utils";
import { ApiError } from "../../utils/apiError.utils";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import {
  syncMerchantSubscriptions,
  getMerchantSubscriptionsById,
} from "../../daos/merchant/merchantSubsciption.dao";

export const createOrUpdateMerchantSelection = asyncHandler(
  async (req: Request, res: Response) => {
    const { selections } = req.body;
    const merchantId = (req as any).user?._id;
    // Expected 'selections': [{ chainId: 11155111, tokenAddresses: ["0x123...", "0x456..."] }]

    if (!merchantId || !selections || !Array.isArray(selections)) {
      throw new ApiError(
        "Merchant ID and a valid selections array are required",
        400,
      );
    }

    const result = await syncMerchantSubscriptions(merchantId, selections);
    return new ApiResponse(
          200,
          result,
          "Merchant subscriptions updated successfully",
        );
  },
);

// get merchant subscription details for a merchant
export const getMerchantSubscriptionDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const merchantId = (req as any).user?._id;

    if (!merchantId) {
      throw new ApiError("Merchant ID not found in session", 401);
    }

    const result = await getMerchantSubscriptionsById(merchantId);

    return new ApiResponse(
      200,
      result,
      "Merchant subscription details fetched successfully",
    );
  },
);
