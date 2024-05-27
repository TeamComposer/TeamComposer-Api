const mongoose = require("mongoose");

const alunoSchema = new mongoose.Schema({
  nome: {
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

const Aluno = mongoose.model("Aluno", alunoSchema);

module.exports = Aluno;
