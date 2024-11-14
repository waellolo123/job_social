import { mailtrapClient, sender } from "../lib/mailtrap.js"
import { createCommentNotificationEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";


export const sendWelcomeEmail = async(email, name, profileUrl) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from : sender,
      to: recipient,
      subject: "Welcome to linkedin clone",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome"
    });
    console.log("welcome email sent", response);
  } catch (error) {
    throw error;
  }
}


export const sendCommentNotificationEmail = async (
  recipientEmail, 
  recipientName, 
  commenterName, 
  postUrl, 
  commentContent, 
) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
      category: "comment_notifications"
    });
    console.log("Comment Notification Email Sent", response);
    
  } catch (error) {
    throw error;
  }
} 
