import { Queue } from 'bullmq';
import { connection } from '../configs/server.config';

export let webhookQueue: Queue;

export const initWebHookQueue = async () => {
  if (!webhookQueue) {
    webhookQueue = new Queue('merchant-webhooks', { connection });
  }
  return webhookQueue;
};