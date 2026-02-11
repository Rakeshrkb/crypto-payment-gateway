import Joi from "joi";

export const verifySignUpSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      "string.base": "Password must be a string.",
      "string.pattern.base": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
});
