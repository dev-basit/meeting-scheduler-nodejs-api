const express = require("express");
const router = express.Router();

const { Meeting, validate } = require("../models/meetings");

router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    return res.json(meetings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found for given id." });

    return res.json(meeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const meeting = new Meeting(req.body);
    const savedMeeting = await meeting.save();
    return res.json(savedMeeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMeeting) return res.status(404).json({ message: "Meeting not found for given id." });

    return res.json(updatedMeeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndRemove(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found for given id." });

    return res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
