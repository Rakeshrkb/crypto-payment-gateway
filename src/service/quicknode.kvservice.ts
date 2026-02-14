import axios from 'axios';
import { QUICK_NODE_API_KEY } from "../constants/envConstants";
import { ApiError } from '../utils/apiError.utils';
import { ApiResponse } from '../utils/apiResponse.utils';

export const setQuickNodeKV = async (key: string, intentId: string) => {

    
    try {
        await axios.post(
            'https://api.quicknode.com/kv/rest/v1/sets', 
            {
                key: key,
                value: intentId // Store the ID so the stream can find it
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': QUICK_NODE_API_KEY
                }
            }
        );
        console.log(`KV Set: ${key}`);
    } catch (error) {
        console.error("Failed to set QuickNode KV:", error);
    }
};


export const removeQuickNodeKey = async (usedKey: string) => {
    try {
        await axios.delete(`https://api.quicknode.com/kv/rest/v1/sets/${usedKey}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': QUICK_NODE_API_KEY
            }
        });
        console.log(`Successfully removed key: ${usedKey}`);
    } catch (error: any) {
       throw new ApiError("Error removing QuickNode key:", 400);
    }
};