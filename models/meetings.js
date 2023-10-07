const Joi = require("joi");
const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

function validateMeeting(meeting) {
  const schema = {
    title: Joi.string().min(2).max(255).required(),
    date: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
  };

  return Joi.validate(meeting, schema);
}

exports.Meeting = Meeting;
exports.validate = validateMeeting;
