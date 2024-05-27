// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  papel: {
    type: String,
    enum: ["Professor", "Aluno"],
    default: "Aluno",
  },
  periodo: {
    type: Number,
    default: null,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
