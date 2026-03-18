import express from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  confirmPayment,
  stripeWebhook,
  verifyRazorpay,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/confirm", userAuth, confirmPayment);
orderRouter.post("/verify-razorpay", userAuth, verifyRazorpay);
orderRouter.get("/userorders", userAuth, getUserOrders);

// Webhooks (no auth)
orderRouter.post("/webhook/stripe", stripeWebhook);

// Admin routes
orderRouter.get("/list", adminAuth, getAllOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);

export default orderRouter;
