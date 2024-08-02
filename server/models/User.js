import mongoose from "mongoose";



const pointsSchema = new mongoose.Schema({
    name: String,
    email: String,
    YourPoints: Number,
    upvotePoints: Number,
    totalVotes: Number,
  });
  
const Points = mongoose.model('Points', pointsSchema);

export default Points;