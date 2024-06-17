const mongoose = require("mongoose");

const alunoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true,
    unique: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  funcao: {
    type: String,
    enum: [
      "Backend",
      "Frontend",
      "FullStack",
      "PM",
      "UX/UI",
      "QA",
    ],
    required: true,
  },
  nivel: {
    type: Number,
    required: true,
  },
  time: {
    type: mongoose.Schema.Types.ObjectId, ref: "Team",
    default: null,
  },
});

const Aluno = mongoose.model("Aluno", alunoSchema);

module.exports = Aluno;
