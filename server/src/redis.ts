import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  port: parseInt(process.env.REDIS_PORT || '6379'),
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'), 
});

export default redisClient;