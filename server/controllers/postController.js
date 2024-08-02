import Post from '../models/postvideo.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadDir = path.resolve('Questionposts');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}.mp4`;
    cb(null, uniqueFilename);
  },
});



export const upload = multer({ storage: storage });


export const uploadPost = async (req, res) => {
  try {
    const { name, email, title, tag, upvotes, date, time } = req.body;

    if (!name || !email || !title || !tag || upvotes === undefined || !date || !time) {
      throw new Error('Missing required fields');
    }

    const video = req.file ? req.file.filename : null;
    if (!video) {
      throw new Error('Video file is required');
    }

    const newPost = new Post({
      name,
      email,
      title,
      tag,
      upvotes,
      video,
      date,
      time,
      answers: []
    });

    const savedPost = await newPost.save();

    const postData = {
      name: savedPost.name,
      email: savedPost.email,
      title: savedPost.title,
      tag: savedPost.tag,
      upvotes: savedPost.upvotes,
      filename: video,
      date: savedPost.date,
      time: savedPost.time,
      answers: savedPost.answers
    };
    const filePath = path.join(uploadDir, `post-${savedPost._id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}, 'name email title tag upvotes video date time answers');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};


export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { answer, answerVote,PostedUser } = req.body;

  if (!answer || answerVote === undefined) {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.answers.push({ answer, answerVote, PostedUser });

    const updatedPost = await post.save();

    const filePath = path.join(uploadDir, `post-${id}.json`);
    const postData = {
      name: updatedPost.name,
      email: updatedPost.email,
      title: updatedPost.title,
      tag: updatedPost.tag,
      upvotes: updatedPost.upvotes,
      video: updatedPost.video,
      date: updatedPost.date,
      time: updatedPost.time,
      answers: updatedPost.answers
    };
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));

    res.status(200).json(updatedPost);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error updating post', error });
    }
  }
};

export const updateAnswerVote = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;


  if (!answers || !Array.isArray(answers)) {
    console.log('Invalid or missing answers field'); 
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.answers = answers;

    const updatedPost = await post.save();

    const filePath = path.join(uploadDir, `post-${id}.json`);
    const postData = {
      name: updatedPost.name,
      email: updatedPost.email,
      title: updatedPost.title,
      tag: updatedPost.tag,
      upvotes: updatedPost.upvotes,
      video: updatedPost.video,
      date: updatedPost.date,
      time: updatedPost.time,
      answers: updatedPost.answers
    };
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating answer votes:', error); // Debugging log
    res.status(500).json({ message: 'Error updating answer votes', error });
  }
};




export const deleteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;

  try {
    const post = await Post.findById(questionId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const answerIndex = post.answers.findIndex(answer => answer._id.toString() === answerId);

    if (answerIndex === -1) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    post.answers.splice(answerIndex, 1);
    await post.save();

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ message: 'Error deleting answer' });
  }
};
