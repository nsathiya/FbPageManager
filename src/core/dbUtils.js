/* Database Functions */

import promisify from 'es6-promisify';
import { MongoClient, ObjectId } from 'mongodb';

import { MongooseClient } from 'mongoose';
import { mongodbHost } from '../config';


const mongodbUrl = `mongodb://${mongodbHost}` + ':15834/telivy_staging?ssl=true';

// COLLECTIONS
const collectionSplash = 'SplashData2';
const collectionUser = 'users';

// eslint-disable-next-line
let _connection;
const connect = () => {
	if (!mongodbUrl) {
		throw new Error('Environment variable MONGODB_HOST must be set to use API.');
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


let _connectionMongoose;
const connectMongoose = () => {
	if (!mongodbUrl) {
	    throw new Error('Environment variable MONGODB_HOST must be set to use API.');
	}

	return promisify(MongooseClient.connect)(mongodbUrl);
}
// returns a db object
const connectionMongoose = () => {
  if (!_connectionMongoose) {
    _connectionMongoose = connectMongoose();
  }

  return _connectionMongoose;
};

export const getSplashData = async () => {
  try {
	    const db = await connection();
	    const collection = await db.collection(collectionSplash);
	    const data = await collection.find({}).toArray();
    	return data;
  } catch (err) {
    console.log('Error fetching splash data: ', err);
    throw new err
  }
};

export const findUserByEmail = async (email) => {
  try {
	    const db = await connection();
	    const collection = await db.collection(collectionUser);
	    const user = await collection.findOne({'email': email});
    	return user;
  } catch (err) {
    console.log('Error fetching user by email: ', err);
    throw new err
  }
};

export const findUserById = async (id) => {
  try {
	    const db = await connection();
	    const collection = await db.collection(collectionUser);
	    const user = await collection.findOne(ObjectId(id));
    	return user;
  } catch (err) {
    console.log('Error fetching user by id: ', err);
    throw new err
  }
};

export const getAllUsers = async () => {
	try {
		const db = await connection();
		const collection = await db.collection(collectionUser);
		const users = await collection.find({}).toArray();
		return users;
	} catch (err){
		console.log('Error fetching users')
		throw new err;
	}
}

export const createUser = async (user) => {
  try {
	    const db = await connection();
	    const collection = await db.collection(collectionUser);
	    const result = await collection.insert(user);
    	return result;
  } catch (err) {
    console.log('Error creating user: ', err);
    throw new err
  }
};
