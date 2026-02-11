import { UserSchema } from "../models/user.model";
import { ApiError } from "../utils/apiError.utils";

export const createUser = async (email: string, password: string) => {
  try {
    const user = new UserSchema({ email, password });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  return UserSchema
    .findOne({ email })
    .select("+password"); 
};


export const findUserById = async (id: string) => {
  try {
    // Only fetch the _id and email. 
    // This is faster and more secure than fetching everything.
    return await UserSchema.findById(id).select("_id email"); 
  } catch (error) {
    console.error(`DAO: Error finding user by id ${id}:`, error);
    throw error;
  }
};

