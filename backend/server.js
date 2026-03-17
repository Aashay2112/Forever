import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: '../.env' }) // ALWAYS LOAD THIS FIRST

import connectDB from "./config/db.js"
import connectCloudinary from "./config/cloudinary.js"

import userRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import feedbackRouter from "./routes/feedbackRoute.js"

const app = express()

// middleware
app.use(
  express.json({
    verify: (req, res, buf) => {
      // store raw body for Stripe webhook validation
      req.rawBody = buf;
    },
  })
);
app.use(cors())

// database
connectDB()
connectCloudinary()

// test route
app.get("/", (req,res)=>{
  res.send("API WORKING")
})

// routes
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/feedback", feedbackRouter)
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})