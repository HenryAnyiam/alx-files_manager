/* eslint-disable */
import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { v4 as uuidv4 } from "uuid";
import sha1 from 'sha1';

class AuthController {
    static async getConnect(req, res) {
        const auth = req.header('Authorization') || null;
        if (!auth) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const buffer = Buffer.from(auth.replace('Basic ', ''), 'base64');
        const credentials = {
            email: buffer.toString('utf-8').split(':')[0],
            password: buffer.toString('utf-8').split(':')[1],
        };

        if (!credentials.email || !credentials.password) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        credentials.password = sha1(credentials.password);

        const user = await dbClient.db.collection('users').findOne(credentials);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 86400);

        return res.status(200).json({ token })
    }

    static async getDisconnect(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const redisToken = await redisClient.get(`auth_${token}`);
        if (!redisToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(`auth_${token}`);
        return res.status(204).send();
    }
}

module.exports = AuthController;
