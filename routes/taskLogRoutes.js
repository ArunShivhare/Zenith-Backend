const express = require("express");
const router = express.Router();
const TaskLog = require("../models/TaskLog");
const Task = require("../models/Task");
const verifyToken = require("../middleware/authMiddleware");

// 📌 GET today's scheduled tasks
router.get("/today", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];

    const logs = await TaskLog.find({
      userId: req.user.firebaseId,
      date: today,
    }).populate("taskId");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 SCHEDULE a task for specific hour
router.post("/schedule", verifyToken, async (req, res) => {
  try {
    const { taskId, hour } = req.body;

    const now = new Date();

    // ✅ LOCAL DATE (NOT UTC)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];

    // ✅ LOCAL TIME (NO SHIFT)
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      0,
      0,
    );

    const log = new TaskLog({
      taskId,
      userId: req.user.firebaseId,
      date: today,
      scheduledTime,
    });

    await log.save();

    const populatedLog = await log.populate("taskId");
    const existing = await TaskLog.findOne({
      taskId,
      userId: req.user.firebaseId,
      date: today,
    });

    if (existing) {
      return res.json(existing); // prevent duplicate
    }

    res.json(populatedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 MARK COMPLETE
router.put("/:id/complete", verifyToken, async (req, res) => {
  try {
    const log = await TaskLog.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.firebaseId,
      },
      { status: "completed" },
      { new: true },
    );

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 UNSCHEDULE (delete log only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await TaskLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.firebaseId,
    });

    res.json({ msg: "Removed from schedule" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 DAILY REVIEW
router.get("/review", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];

    const logs = await TaskLog.find({
      userId: req.user.firebaseId,
      date: today,
    }).populate("taskId");

    const completed = logs.filter((l) => l.status === "completed");
    const missed = logs.filter((l) => l.status !== "completed");

    res.json({
      total: logs.length,
      completed: completed.length,
      missed: missed.length,
      logs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
