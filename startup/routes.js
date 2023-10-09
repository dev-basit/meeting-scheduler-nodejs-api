const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const meetings = require("../routes/meetings");
const feedbacks = require("../routes/feedback");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/meetings", meetings);
  app.use("/api/feedbacks", feedbacks);
  app.use("/api/auth", auth);
  app.use(error);
};
