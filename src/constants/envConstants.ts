import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing!`);
  }
  return value;
};

const JWT_SECRET = getEnvVar("JWT_SECRET");
const JWT_EXPIRES_IN = getEnvVar("JWT_EXPIRES_IN");
const QUICK_NODE_API_KEY = getEnvVar("QUICKNODE_API_KEY");
const INR_PER_USD = getEnvVar("INR_PRICE_PER_USD");
const QUICKNODE_SECURITY_TOKEN = getEnvVar("QUICKNODE_SECURITY_TOKEN");
const QUICKNODE_SEPOLIA_STREAM_ID = getEnvVar("QUICKNODE_SEPOLIA_STREAM_ID");
const PORT = getEnvVar("PORT");


export {PORT, JWT_SECRET, JWT_EXPIRES_IN, QUICK_NODE_API_KEY, INR_PER_USD, QUICKNODE_SECURITY_TOKEN, QUICKNODE_SEPOLIA_STREAM_ID};