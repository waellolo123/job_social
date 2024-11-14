import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";


export const getSuggestionsConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");
    // find users who are not already connected
    const suggestedUsers = await User.find({
      _id: {
        // not equal (ne), not in (nin)
        $ne: req.user._id, $nin: currentUser.connections
      }
    }).select("name username profilePicture headline").limit(3);
    res.json(suggestedUsers);
  } catch (error) {
    console.error("Error in getSuggestionsConnections controller", error);
    res.status(500).json({message: "Server error"});
  }
};


export const getPublicProfile = async(req, res) => {
  try {
    const user = await User.findOne({username: req.params.username}).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting public profile", error);
    res.status(500).json({message: "Server error"});
  }
}

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education"
    ];
    const updatedData = {};
    for(const field of allowedFields) {
      if(req.body[field]){
        updatedData[field] = req.body[field];
      }
    }

    // todo check for profile picture and banner image
    if(req.body.profilePicture){
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updatedData.profilePicture = result.secure_url;
    }

    if(req.body.bannerImg){
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updatedData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile", error);
    res.status(500).json({message: "Server error"});
  }
}


