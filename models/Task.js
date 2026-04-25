const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    tags: {
      type: [String],
      default: [],
    },
    history: [
      {
        date: String, // "2026-04-25"
        status: String, // "completed" | "pending"
      },
    ],
    dueDate: Date,
    scheduledTime: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
