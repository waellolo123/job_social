import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js";
import ConnectionRequest from "../models/connectionRequestModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

//  send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const {userId} = req.params;
    const senderId = req.user._id;
    if(senderId.toString() === userId){
      return res.status(400).json({message: 'You cannot send a connection request to yourself'});
    }
    if(req.user.connections.includes(userId)){
      return res.status(400).json({message: 'You are already connected with this user'});
    }
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending"
    });
    if(existingRequest){
      return res.status(400).json({message: 'A connection request already exists'});
    }
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId
    });
    await newRequest.save();
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
}


// accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId)
    .populate("sender", "name email username")
    .populate("recipient", "name username");
    if(!request){
      return res.status(403).json({message: "Not authorized to accept this request"});
    }
    // check if the req is for the current user
    if(request.recipient._id.toString() !== userId.toString()) {
      return res.status(403).json({message: "Not authorized to accept this request"});
    }
    // check if the request is already accepted or rejected
    if(request.status !== "pending"){
      return res.status(403).json({message: "Request has already been processed"});
    }
    // update the request status to accepted
    request.status = "accepted";
    await request.save();
    // if im your friend then ur also my friend
    await User.findByIdAndUpdate(request.sender._id, {$addToSet: {connections: userId}});
    await User.findByIdAndUpdate(userId, {$addToSet: {connections: request.sender._id}});
    // create a notification
    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId
    });
    res.json({message: "Connection accepted"});
    //  send email
    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;
    try {
      await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
    } catch (error) {
      console.error("Error in sendConnectionAcceptedEmail", error);
    }
  } catch (error) {
    console.error("Error in accept connection", error);
    res.status(500).json({message: "Server error"});
  }
}


// reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId);
    if(request.recipient.toString() !== userId.toString()){
      return res.status(403).json({message: "Not authorized to reject this request"});
    }
    if(request.status !== "pending"){
      return res.status(400).json({message: "this request has already been processed"});
    }
    request.status = "rejected";
    await request.save();
    res.json({message: "Connection request rejected"});
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
}


// get connection requests
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({recipient: userId, status: "pending"}).populate(
      "connections",
      "name username profilePicture headline connections"
    );
    res.json(requests);
  } catch (error) {
    console.error("Error in get user connections", error);
    res.status(500).json({message: "Server error"});
  }
}
