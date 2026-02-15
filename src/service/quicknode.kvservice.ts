import axios from "axios";
import {
  QUICK_NODE_API_KEY,
  QUICKNODE_SEPOLIA_STREAM_ID,
} from "../constants/envConstants";
import { ApiError } from "../utils/apiError.utils";

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "x-api-key": QUICK_NODE_API_KEY,
};

const STREAM_ID = QUICKNODE_SEPOLIA_STREAM_ID;

const BASE_URL = `https://api.quicknode.com/streams/rest/v1`;

export const setQuickNodeKV = async (key: string, intentId: string) => {
  try {
    await axios.post(
      //   "https://api.quicknode.com/kv/rest/v1/sets"
      `${BASE_URL}/sets`,
      {
        key: key,
        value: intentId, // Store the ID so the stream can find it
      },
      {
        headers,
      },
    );
    console.log(`KV Set: ${key}`);
  } catch (error) {
    console.error("Failed to set QuickNode KV:", error);
  }
};

export const removeQuickNodeKey = async (usedKey: string) => {
  try {
    await axios.delete(`${BASE_URL}/sets/${usedKey}`, {
      headers,
    });
    console.log(`Successfully removed key: ${usedKey}`);
  } catch (error: any) {
    throw new ApiError("Error removing QuickNode key:", 400);
  }
};

export const activateQuickNodeStream = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/streams/${STREAM_ID}/activate`,
      {},
      { headers },
    );
    console.log("🟢 QuickNode Stream: ACTIVATED. (Monitoring started)");
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to activate stream:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const pauseQuickNodeStream = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/streams/${STREAM_ID}/pause`,
      {},
      { headers },
    );
    console.log("🛑 QuickNode Stream: PAUSED");
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to pause stream:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
