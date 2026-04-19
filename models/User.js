const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    firebaseId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);