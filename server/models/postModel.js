import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  content: String,
  image: String,
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  comments: [{
    content: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now}
  }]
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
export default Post;
