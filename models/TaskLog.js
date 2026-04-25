const mongoose = require("mongoose");

const taskLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  hour: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "missed"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("TaskLog", taskLogSchema);