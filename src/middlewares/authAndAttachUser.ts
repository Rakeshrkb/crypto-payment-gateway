import { Request, Response, NextFunction } from "express";
import jwt, {
  JwtPayload,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";
import { findUserById } from "../daos/user.dao";
import { JWT_SECRET } from "../constants/envConstants";

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export const authAndAttachUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log("got here");
  const excludedPaths = ["/api/merchant/createPaymentIntent","/api/blockchains/receive_quicknode_events"];

  if (excludedPaths.includes(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  let decoded: unknown;

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    decoded = jwt.verify(token!, JWT_SECRET!, {
      algorithms: ["HS256"],
    }) as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (typeof decoded !== "object" || decoded === null || !("id" in decoded)) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  const payload = decoded as AuthTokenPayload;

  const user = await findUserById(payload.id);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};
