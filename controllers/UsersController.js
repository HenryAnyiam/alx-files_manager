/* eslint-disable */

import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import sha1 from 'sha1';

const { ObjectId } = require('mongodb');
const Bull = require('bull');

class UsersController {
    static async postNew(req, res) {
        const userQueue = new Bull('userQueue');
        
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'Missing email' });
        }
        
        const userPassword = req.body.password;
        if (!userPassword) {
            return res.status(400).json({ error: 'Missing password' });
        }
        
        const oldUserEmail = await dbClient.db.collection('users').findOne({ email: userEmail });
        
        if (oldUserEmail) {
            return response.status(400).json({ error: 'Already exist' });
        }
        
        const shaUserPassword = sha1(userPassword);
        const result = await dbClient.db.collection('users').insertOne({ email: userEmail, password: shaUserPassword });
        
        userQueue.add({
            userId: result.insertedId,
        });
  
      return res.status(201).json({ id: result.insertedId, email: userEmail });
    }
  
    static async getMe(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) {
            return response.status(401).json({ error: 'Unauthorized' });
        }
        
        const redisToken = await redisClient.get(`auth_${token}`);
        if (!redisToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        delete user.password;
        
        return res.status(200).json({ id: user._id, email: user.email });
    }
  }
  
  module.exports = UsersController;
  