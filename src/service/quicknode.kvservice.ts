import axios from 'axios';
import { QUICK_NODE_API_KEY } from "../constants/envConstants";

export const setQuickNodeKV = async (merchantAddress: string, rawAmount: string, intentId: string) => {
    const key = `${merchantAddress.toLowerCase()}_${rawAmount}`;
    
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