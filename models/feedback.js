const Joi = require("joi");
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

function validateFeedback(feedback) {
  const schema = {
    description: Joi.string().min(2).max(1024).required(),
  };

  return Joi.validate(feedback, schema);
}

exports.Feedback = Feedback;
exports.validate = validateFeedback;
