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
  funcao: [{
    type: String,
    enum: [
      "Desenvolvedor Backend",
      "Desenvolvedor Frontend",
      "Desenvolvedor FullStack",
      "Project Manager",
      "Designer UX/UI",
      "QA Tester",
    ],
    nivel: {
      type: String,
      enum: ["Nenhum", "Junior", "Pleno", "Senior"],
    },
  }],
  emTime: {
    type: Boolean,
    default: false,
  },
});

const Aluno = mongoose.model("Aluno", alunoSchema);

module.exports = Aluno;
