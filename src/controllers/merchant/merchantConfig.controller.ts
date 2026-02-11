import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/apiResponse.utils";
import { ApiError } from "../../utils/apiError.utils";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import { createMerchantConfigDAO, updateMerchantConfigDAO } from "../../daos/merchant/merchantConfig.dao";

export const saveMerchantConfig = asyncHandler(async (req: Request, res: Response) => {
    const { monitoringAddress, webhookUrl } = req.body;
    if(!monitoringAddress || !webhookUrl){
        throw new ApiError("Not enough data", 400);
    }
    const merchantId = (req as any).user._id;
    await createMerchantConfigDAO(merchantId, monitoringAddress, webhookUrl);
    return new ApiResponse(200,null,"Merchant config updated successfully",) 
});

export const updateMerchantConfig = asyncHandler(async (req: Request, res: Response) => {
    const { monitoringAddress, webhookUrl, isActive } = req.body;
    const merchantId = (req as any).user._id;

    // Create an update object with only the fields that were actually provided
    const updateData: any = {};
    if (monitoringAddress !== undefined) updateData.monitoringAddress = monitoringAddress;
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError("No fields provided for update", 400);
    }

    const updatedConfig = await updateMerchantConfigDAO(merchantId, updateData);

    if (!updatedConfig) {
        throw new ApiError("Merchant configuration not found", 404);
    }

    return res.status(200).json(
        new ApiResponse(200, updatedConfig, "Configuration updated successfully")
    );
});