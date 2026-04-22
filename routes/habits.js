const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const verifyToken = require("../middleware/authMiddleware");

// GET habits
router.get("/", verifyToken, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.uid });
  res.json(habits);
});

// ADD habit
router.post("/", verifyToken, async (req, res) => {
  const habit = new Habit({
    title: req.body.title,
    userId: req.user.uid,
  });

  await habit.save();
  res.json(habit);
});

// DELETE habit
router.delete("/:id", verifyToken, async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ msg: "Habit deleted" });
});

// UPDATE habit title
router.put("/:id", verifyToken, async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  );

  res.json(habit);
});

// TOGGLE habit for today
router.put("/:id/toggle", verifyToken, async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const habit = await Habit.findById(req.params.id);

  if (!habit) return res.status(404).json({ msg: "Not found" });

  if (habit.completedDates.includes(today)) {
    habit.completedDates = habit.completedDates.filter(
      (d) => d !== today
    );
  } else {
    habit.completedDates.push(today);
  }

  await habit.save();
  res.json(habit);
});

module.exports = router;