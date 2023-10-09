const express = require("express");
const router = express.Router();

const { Feedback, validate } = require("../models/feedback");

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    return res.json(feedbacks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    return res.json(savedFeedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
