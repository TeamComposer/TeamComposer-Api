// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  primeiroNome: {
    type: String,
    required: true,
  },
  sobrenome: {
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
  senha: {
    type: String,
    required: true,
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
