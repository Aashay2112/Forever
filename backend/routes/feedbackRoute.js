import express from "express";
import { addFeedback, listFeedbacks } from "../controllers/feedbackController.js";
import adminAuth from "../middleware/adminAuth.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/add", addFeedback);
feedbackRouter.get("/list", adminAuth, listFeedbacks);

export default feedbackRouter;
