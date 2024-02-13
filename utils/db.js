/* eslint-disable */
const { MongoClient } = require('mongodb');

class DBClient {
  
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    MongoClient.connect(url, (err, client) => {
      if (!err) {
        this.db = client.db(database);
      } else {
        this.db = false;
      }
    });
  }

  isAlive() {
    if (this.db) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    let val = this.db.collection('users').countDocuments();
    return val;
  }

  async nbFiles() {
    let val = this.db.collection('files').countDocuments();
    return val;
  }

}

const dbClient = new DBClient();

export default dbClient;
