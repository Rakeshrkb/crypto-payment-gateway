import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.utils";

export const verifyQuickNodePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const incomingToken = req.headers['x-qn-token'] || req.headers['authorization'];
  // console.log("token is ", incomingToken);

  // if (!incomingToken || incomingToken !== QUICKNODE_SECURITY_TOKEN) {
  //     throw new ApiError("Unauthorized: Invalid QuickNode Token", 401);
  // }

  const qnHeader = req.headers["x-qn-signature"];
  const localToken = process.env.QUICKNODE_SECURITY_TOKEN;
  // 2. Check if the token exists and matches
  if (!qnHeader || qnHeader !== localToken) {
    console.warn("⚠️  Unauthorized Webhook Attempt detected!");
    return new ApiError("Invalid Security Token", 401);
  }

  next();
};
