/* eslint-disable */
import redisClient from '../utils/redis';
import dbClient from '../utils/db';


class AppController {

  static getStatus(req, res) {
    const redis = redisClient.isAlive();
    const db = dbClient.isAlive();
    return res.status(200).json({ redis, db });
  };

  static async getStats(res, req) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    return res.status(200).json({ users, files });
  }
}

module.exports = AppController;
