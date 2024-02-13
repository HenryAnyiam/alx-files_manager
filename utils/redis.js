/* eslint-disable */
import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = false;
    this.connected;
  }

  async initialize() {
    this.client = await redis.createClient()
    .on('connect', () => {
      console.log("Redis client connected to the server");
      this.connected = true;
    })
    .on('error', (err) => {
    console.log("Redis client not connected to the server:", err);
    })
    .connect();
    return this;
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const val = await this.client.get(key);
    return val;
  }

  async set(key, val, dur) {
    await this.client.set(key, val);
    await this.client.expire(key, dur)
  }

  async del(key) {
    await this.client.del(key);
  }
}
const redisclient = new RedisClient();
const redisClient = await redisclient.initialize();
export default redisClient;
