import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Lazy initialize Stripe
const getStripe = () => {
  return process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY.replace(/"/g, "").trim())
    : null;
};

// Lazy initialize Razorpay
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.replace(/"/g, "").trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.replace(/"/g, "").trim();
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;

    const currency = process.env.PAYMENT_CURRENCY || "INR";

    const orderData = {
      userId: req.user._id,
      items,
      amount,
      currency,
      address,
      paymentMethod,
      payment: false,
      date: Date.now(),
    };

    const order = new orderModel(orderData);
    await order.save();

    // Clear user's cart
    req.user.cartData = {};
    await req.user.save();

    // ── COD flow ─────────────────────────────────────────────────────────────
    if (paymentMethod === "cod") {
      order.payment = true;
      order.status = "Order Placed";
      await order.save();
      return res.json({ success: true, message: "Order Placed", orderId: order._id });
    }

    // ── Stripe flow ───────────────────────────────────────────────────────────
    if (paymentMethod === "stripe") {
      const stripe = getStripe();
      if (!stripe) {
        return res.json({
          success: false,
          message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in the backend .env.",
        });
      }

      try {
        const lineItems = items.map((item) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}&paymentMethod=stripe&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/placeorder`,
          metadata: { orderId: order._id.toString() },
        });

        return res.json({ success: true, payment: "stripe", sessionUrl: session.url });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError.message);
        return res.json({ success: false, message: `Stripe error: ${stripeError.message}` });
      }
    }

    // ── Razorpay flow ─────────────────────────────────────────────────────────
    if (paymentMethod === "razorpay") {
      const razorpay = getRazorpay();
      if (!razorpay) {
        return res.json({
          success: false,
          message: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend .env.",
        });
      }

      try {
        // Razorpay amount is in paise (₹1 = 100 paise)
        const rpOrder = await razorpay.orders.create({
          amount: Math.round(amount * 100),
          currency: currency,
          receipt: order._id.toString(),
        });

        return res.json({
          success: true,
          payment: "razorpay",
          razorpayOrderId: rpOrder.id,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          orderId: order._id,
          keyId: process.env.RAZORPAY_KEY_ID?.replace(/"/g, "").trim(),
        });
      } catch (rpError) {
        console.error("Razorpay error:", rpError.message);
        return res.json({ success: false, message: `Razorpay error: ${rpError.message}` });
      }
    }

    res.json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment (called after modal success)
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.replace(/"/g, "").trim();
    if (!keySecret) {
      return res.json({ success: false, message: "Razorpay secret not configured" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid payment signature" });
    }

    // Mark order as paid
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    order.payment = true;
    order.status = "Paid";
    order.paymentId = razorpay_payment_id;
    order.paymentMethod = "razorpay";
    await order.save();

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.log("Razorpay verify error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Confirm Payment (called after Stripe success redirect)
const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    order.payment = true;
    order.status = "Paid";
    order.paymentMethod = paymentMethod || order.paymentMethod;

    if (paymentId) {
      order.paymentId = paymentId;
    }

    await order.save();

    res.json({ success: true, message: "Payment confirmed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe Webhook
const stripeWebhook = async (req, res) => {
  try {
    const stripe = getStripe();
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !stripeWebhookSecret) {
      return res.status(400).send("Stripe webhook not configured.");
    }

    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.payment_intent;

      const order = await orderModel.findById(orderId);
      if (order) {
        order.payment = true;
        order.status = "Paid";
        order.paymentMethod = "stripe";
        order.paymentId = paymentId;
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.log("Stripe webhook error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Update Order Status (for admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  getUserOrders,
  getAllOrders,
  confirmPayment,
  stripeWebhook,
  verifyRazorpay,
  updateOrderStatus,
};
