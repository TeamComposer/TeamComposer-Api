// src/models/User.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  membros: [{
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno" }
  }],
  comunicacao: {
    type: String,
    default: null,
  },
  projeto: {
    type: mongoose.Schema.Types.ObjectId, ref: "Projeto",
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
teamSchema.index({ 'membros.aluno': 1 });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
