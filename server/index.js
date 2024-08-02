
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import Nexmo from 'nexmo';
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import PointsRoutes from './routes/points.js'

import VideoRoutes from './routes/video.js';
import QuestionRoutes from './routes/question.js';
import PostRoute from './routes/posts.js';
import loginRoutes from './routes/login.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app =express();
app.use(bodyParser.json())
app.use(cors());


const mongoURI = process.env.MONGO_URI;

app.get('/',(req,res) =>{
    res.send('Welcome to Bakend');
})

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'Questionposts')));



app.use('/post',PointsRoutes);
app.use('/question',VideoRoutes);
app.use('/ask',QuestionRoutes);
app.use('/answer',PostRoute);
app.use('/login', loginRoutes);


//Email-Otp##########################################################

let otpStore = {};

app.post('/otp-send', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    otpStore[email] = otp;
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email]; 
    res.status(200).send('OTP verified successfully');
  } else {
    res.status(400).send('Invalid OTP');
  }
});


// Mobile-Otp########################################################



const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
});

let Store1 = {}; 

app.post('/phone-otp', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  Store1[phoneNumber] = otp;
  const message = `Your OTP code is ${otp}`;
  nexmo.message.sendSms('NEXMO', phoneNumber, message, (err, responseData) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (responseData.messages[0].status === "0") {
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } else {
      res.status(500).json({ success: false, error: responseData.messages[0]['error-text'] });
    }
  });
});

app.post('/phone-verify', (req, res) => {
  const { phoneNumber, otp } = req.body;

  console.log(`Received phoneNumber: ${phoneNumber}, otp: ${otp}`);

  if (!phoneNumber || !otp) {
    console.error('phoneNumber or otp not provided');
    return res.status(400).json({ success: false, message: "phoneNumber or otp not provided" });
  }

  if (Store1[phoneNumber] && Store1[phoneNumber] == otp) {
    console.log('OTP verified successfully');
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } else {
    console.error('Invalid OTP');
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});



const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server listening on port ${port}`));






