import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";


export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({author: {$in: req.user.connections}})
    .populate("author", "name username profilePicture headline")
    .populate("comments.user", "name profilePicture")
    .sort({createdAt: -1});
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in get feed posts controller", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}


export const createPost = async (req, res) => {
  try {
    const {content, image} = req.body;
    let newPost;
    if(image){
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url
      })
    } else {
      newPost = new Post({
        author: req.user._id,
        content
      })
    }
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in create post controller", error.message);
    res.status(500).json({ message: "Error creating post" });
  }
}


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    if(post.author.toString() !== userId.toString()){
      return res.status(403).json({ message: "You can't delete this post" });
    }
    if(post.image){
      //  delete image from cloudinary
      await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "post deleted" });
  } catch (error) {
    console.error("Error in delete post controller", error.message);
    res.status(500).json({ message: "Error deleting post" });
  }
}


export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
    .populate("author", "name username profilePicture headline")
    .populate("comments.user", "name profilePicture");
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in get post by id controller", error);
    res.status(500).json({ message: "Error getting post" });
  }
}


export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const {content} = req.body;
    const post = await Post.findByIdAndUpdate(postId, {
      $push: {comments: {user: req.user._id, content}}
    }, {new: true}).populate("author", "name email username headline profilePicture");
    // create a notification if the comment owner is not the post owner
    if(post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId
      });
      await newNotification.save();
      // send email notification
      try {
        const postUrl = process.env.CLIENT_URL + "/post/²" + postId;
        await sendCommentNotificationEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
      } catch (error) {
        console.log("Error sending comment notification", error);
      }
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in add comment controller", error);
    res.status(500).json({ message: "Error creating comment" });
  }
}


export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;
    if(post.likes.includes(userId)){
      // unlike post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // like post
     post.likes.push(userId);
    //  create notification if the post owner is not the user who liked
    if(post.author.toString() !== userId.toString()){
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedUser: userId,
        relatedPost: postId
      });
      await newNotification.save();
    }
      await post.save();
      res.status(200).json(post)
    }
  } catch (error) {
    console.error("Error in like post controller", error);
    res.status(500).json({ message: "Server Error" });
  }
}
