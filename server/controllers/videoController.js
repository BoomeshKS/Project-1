import Video from '../models/Videodata.js';
import fs from 'fs'
import path from 'path';
import Post from '../models/postvideo.js';
import multer from 'multer';

const uploadDir =path.resolve('uploads')

export const uploadVideo = async (req, res) => {
  const { email, otp } = req.body;
  const videoPath = req.file.path;

  const newVideo = new Video({ email, otp, videoPath });

  try {
    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', videoUrl: `/uploads/${path.basename(videoPath)}` });
  } catch (error) {
    res.status(500).send('Error uploading video');
  }
};


const uploadDir2 = path.resolve('uploads/videos');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


export const getAllVideos = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading video directory');
    }

    const videos = files.map((file, index) => ({
      id: index,
      name: file,
      url: `/question/videos/number/${index}`
    }));

    res.json(videos);
  });
};





