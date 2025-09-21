// netlify/functions/send-push.js
const webpush = require("web-push");
 
exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
 
  // Preflight request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }
 
  try {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      throw new Error("VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY not set in Netlify environment");
    }
 
    // Make sure body exists
    if (!event.body) {
      throw new Error("Request body is empty");
    }
 
    // Parse subscription JSON
    const subscription = JSON.parse(event.body);
    console.log("Subscription received:", subscription);
 
    // Set VAPID details
    webpush.setVapidDetails(
      "mailto:you@example.com",
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
 
    // Send push notification
    await webpush.sendNotification(subscription, JSON.stringify({
      title: "Hello!",
      body: "This is a test push message",
      icon: "https://heilotiastudio.github.io/MarkusPWA/apple-touch-icon.png"
    }));
 
    return { statusCode: 200, body: JSON.stringify({ message: "Push sent!" }), headers };
 
  } catch (err) {
    console.error("Push error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }), headers };
  }
};
