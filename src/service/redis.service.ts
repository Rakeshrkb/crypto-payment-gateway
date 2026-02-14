import { Redis } from 'ioredis';

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: 3, 
});