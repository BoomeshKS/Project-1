import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  userid: String,
  username: String,
  browser: String,
  os: String,
  device: String,
  ip: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Login', LoginSchema);
