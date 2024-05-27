// src/models/User.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  membros: {
    type: [
      {
        aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno" },
        funcao: {
          type: String,
          enum: [
            "Desenvolvedor Backend",
            "Desenvolvedor Frontend",
            "Desenvolvedor FullStack",
            "Database Operator",
            "Gerente",
            "Designer UX/UI",
            "QA Tester",
          ],
        },
      },
    ],
    default: [],
  },
  comunicacao: {
    type: String,
    default: null,
  },
  projeto: {
    type: String,
    required: true,
    unique: true,
  },
  descricaoProjeto: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["Ativo", "Inativo"],
    default: "Ativo",
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
