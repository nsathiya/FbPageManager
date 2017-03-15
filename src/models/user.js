import mongoose from 'mongoose';

export const User = mongoose.model('User', {
	username: String,
	password: String,
	email: String
})