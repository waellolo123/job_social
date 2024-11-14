import Notification from "../models/notificationModel.js"

// get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({recipient: req.user._id}).sort({createdAt: -1})
    .populate("relatedUser", "name usrename profilePicture")
    .populate("relatedPost", "content image");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getUserNotifications", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// mark notifications as read
export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findByIdAndUpdate(
      {_id: notificationId, recipient: req.user._id},
      {read: true},
      {new: true}
  );
  res.json(notification);
  } catch {
    console.error("Error in mark notification controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// delete notifications
export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: req.user._id
    });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in delete notification", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}