import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getCart, updateCart, clearCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

// Get the current user's cart
cartRouter.get("/get", userAuth, getCart);

// Replace the user's cart with the provided cart data
cartRouter.post("/update", userAuth, updateCart);

// Clear the user's cart
cartRouter.post("/clear", userAuth, clearCart);

export default cartRouter;
