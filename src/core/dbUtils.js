/* Database Functions */

import promisify from 'es6-promisify';
import { MongoClient } from 'mongodb';
import { mongodbHost } from '../config';


const mongodbUrl = `mongodb://${mongodbHost}`;   // + ':27017/telivy';

// COLLECTIONS
const collectionSplash = 'splashData';

// eslint-disable-next-line 
let _connection;

const connect = () => {
  if (!mongodbUrl) {
    throw new Error('Environment variable MONGO_CONNECTION_STRING must be set to use API.');
  }

  return promisify(MongoClient.connect)(mongodbUrl);
};

// returns a db object
const connection = () => {
  if (!_connection) {
    _connection = connect();
  }

  return _connection;
};


export const getSplashData = async () => {
  try {
	    const db = await connection();
	    const collection = await db.collection(collectionSplash);
	    const data = await collection.find({}).toArray();
    return data;
  } catch (err) {
    console.log('Error fetching splash data: ', err);
  }
};
