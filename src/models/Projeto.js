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
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

const Projeto = mongoose.model("Projeto", projetoSchema);

module.exports = Projeto;
