import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  answerVote: { type: Number, required: true, default: 0 },
  PostedUser : { type: String, required: true},
  upvotedBy: { type: [String], default: [] },
});


const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  upvotes: { type: Number, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  tag: {type:String,required:true},
  video: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  answers: { type: [answerSchema], default: [] },

});

const Post = mongoose.model('Post', postSchema);

export default Post;
