import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.utils";
import { QUICKNODE_SECURITY_TOKEN } from "../constants/envConstants";

export const verifyQuickNodeToken = (req: Request, res: Response, next: NextFunction) => {
    // QuickNode sends the token in the headers
    const incomingToken = req.headers['x-qn-token'] || req.headers['authorization'];
    console.log("token is ", incomingToken);

    if (!incomingToken || incomingToken !== QUICKNODE_SECURITY_TOKEN) {
        throw new ApiError("Unauthorized: Invalid QuickNode Token", 401);
    }
    next();
};