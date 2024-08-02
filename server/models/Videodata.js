import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  email: String,
  otp: String,
  videoPath: String,
  createAt: { type: Date, default: Date.now },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
