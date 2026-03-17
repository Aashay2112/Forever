import feedbackModel from "../models/feedbackModel.js";

// Route for adding new feedback
const addFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const feedbackData = {
      name,
      email,
      message,
      date: Date.now()
    };

    const feedback = new feedbackModel(feedbackData);
    await feedback.save();

    res.json({ success: true, message: "Feedback Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for getting all feedbacks (Admin)
const listFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find({}).sort({ date: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addFeedback, listFeedbacks };
