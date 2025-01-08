const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: Number, required: true, enum: [0, 1] },  // 0 for admin || 1 for user
});

module.exports = mongoose.model("User", userSchema);
