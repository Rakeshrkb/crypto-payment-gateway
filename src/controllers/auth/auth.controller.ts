import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../../daos/user.dao';
import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../constants/envConstants';
import { asyncHandler } from '../../utils/asyncHandler.utils';
import { ApiResponse } from '../../utils/apiResponse.utils';
import { ApiError } from '../../utils/apiError.utils';

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required",400);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError("User already exists",409);
  }

  const newUser = await createUser(email, password);

  const options: SignOptions = {
  algorithm: "HS256", 
  expiresIn: JWT_EXPIRES_IN as any, 
  issuer: "my_app"
};

const payload = {
  id : newUser._id.toString(),
}

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    options
  );

  return new ApiResponse(201, { token }, "Signup successful");
});


export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required",400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError("Invalid credentials",401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials",401);
  }

  if(!JWT_SECRET || !JWT_EXPIRES_IN) {
    throw new ApiError("JWT_SECRET and JWT_EXPIRES_IN must be defined in environment variables",500);
  }

  const payload = {
    id : user._id.toString(),
  }

const options: SignOptions = {
  algorithm: "HS256", 
  expiresIn: JWT_EXPIRES_IN as any,
  issuer: "my_app"
};

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    options
  );

  return new ApiResponse(200, { token }, "Signin successful");
});