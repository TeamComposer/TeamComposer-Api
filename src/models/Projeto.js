const mongoose = require("mongoose");

const projetoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  dataFim: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      "Planejado", //
      "Em andamento",
      "Concluído",
      "Pausado",
      "Cancelado",
    ],
    default: "Planejado",
  },
  membros: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aluno",
    },
  ],
  tarefas: [
    {
      descricao: {
        type: String,
        required: true,
      },
      responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aluno",
      },
      status: {
        type: String,
        enum: ["pendente", "em andamento", "concluido"],
        default: "pendente",
      },
      prazo: {
        type: Date,
      },
    },
  ],
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

const Projeto = mongoose.model("Projeto", projetoSchema);

module.exports = Projeto;
