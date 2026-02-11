import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiError } from "../utils/apiError.utils";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new ApiError(message, 400));
    }

    next();
  };
};
