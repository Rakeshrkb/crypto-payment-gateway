import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.utils";

export const verifyQuickNodePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signature = req.headers["x-qn-signature"] as string;
    const secret = process.env.QUICKNODE_SECURITY_TOKEN;

    if (!signature || !secret) {
      throw new ApiError("Missing webhook signature", 401);
    }

    const rawBody = req.body; // Buffer (because express.raw)
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("⚠️ Invalid Webhook Signature!");
      throw new ApiError("Invalid webhook signature", 401);
    }

    // Convert buffer to JSON for next middleware
    req.body = JSON.parse(rawBody.toString());

    next();
  } catch (error) {
    next(error);
  }
};
