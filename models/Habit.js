const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  title: String,
  userId: String,

  completedDates: {
    type: [String], // e.g. ["2026-04-22"]
    default: [],
  },
});

module.exports = mongoose.model("Habit", habitSchema);