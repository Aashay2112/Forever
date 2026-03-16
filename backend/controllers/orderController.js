import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";

// Lazy initialize stripe when needed since ES modules hoist imports before dotenv config
const getStripe = () => {
  return process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY.replace(/"/g, '').trim()) : null;
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

    // COD flow (no third-party payment)
    if (paymentMethod === "cod") {
      return res.json({ success: true, message: "Order Placed", orderId: order._id });
    }

    // Stripe Checkout flow
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

        console.log("Creating Stripe session with lineItems:", lineItems);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}&paymentMethod=stripe&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/placeorder`,
          metadata: { orderId: order._id.toString() },
        });

        console.log("Stripe session created:", session.id);

        return res.json({ success: true, payment: "stripe", sessionUrl: session.url });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError.message);
        return res.json({ success: false, message: `Stripe error: ${stripeError.message}` });
      }
    }

    res.json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    console.log(error);
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

// Confirm Payment (called after Stripe success)
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

// Stripe Webhook (use for production reliability)
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

export { placeOrder, getUserOrders, getAllOrders, confirmPayment, stripeWebhook, updateOrderStatus };
