import mongoose from "mongoose";
const Schema = mongoose.Schema;


const UserDataSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

const UserData = mongoose.model('UserData', UserDataSchema);

export default UserData;
