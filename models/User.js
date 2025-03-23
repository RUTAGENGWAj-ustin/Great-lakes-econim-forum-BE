import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';
const { genSalt, hash } = bcryptjs;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

const User = model('User', userSchema);

export default User;
