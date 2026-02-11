import Joi from "joi";
import mongoose from "mongoose";

// Reusable ObjectId validator
const objectIdValidator = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  })
  .messages({
    "any.invalid": "Merchant ID must be a valid MongoDB ObjectId.",
  });

export const verifyMerchantSelectionSchema = Joi.object({
  selections: Joi.array()
    .items(
      Joi.object({
        chainId: Joi.number().integer().positive().required().messages({
          "number.base": "Chain ID must be a number.",
          "number.integer": "Chain ID must be an integer.",
          "number.positive": "Chain ID must be a positive number.",
          "any.required": "Chain ID is required.",
        }),

        tokenAddresses: Joi.array()
          .items(
            Joi.string()
              .pattern(/^0x[a-fA-F0-9]{40}$/)
              .messages({
                "string.pattern.base":
                  "Token address must be a valid Ethereum address.",
              })
          )
          .min(1)
          .required()
          .messages({
            "array.base": "Token addresses must be an array.",
            "array.min": "At least one token address is required per chain.",
            "any.required": "Token addresses are required.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Selections must be an array.",
      "array.min": "At least one chain selection is required.",
      "any.required": "Selections are required.",
    }),
});
