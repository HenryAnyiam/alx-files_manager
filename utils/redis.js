/* eslint-disable */
const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (err) => {
      console.log("Redis client not connected to the server:", err);
    })
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const val = await this.getAsync(key);	
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
const redisClient = new RedisClient();
export default redisClient;
