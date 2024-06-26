// src/controllers/userController.js
const Team = require("../models/Team");
const Projeto = require("../models/Projeto");

// Criação de variáveis para as mensagens a fim de padronizar e deixar mais "limpo" o código,
// sem a necessidade de adicionar uma string talvez muito grande diretamente no código.
const TIME_NAO_ENCONTRADO = "Time não encontrado";
const TIME_EXCLUIDO_COM_SUCESSO = "Time excluído com sucesso!";

// Obtém todos os times
async function getAllTeams(req, res) {
  try {
    const teams = await Team.find().populate('projeto').exec();

    res.status(200).json(teams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// Retorna um time por id
async function getTeamById(req, res) {
  const teamId = req.params.id;

  try {
    const team = await Team.findById(teamId)
    .populate({
      path: 'membros.aluno',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'primeiroNome sobrenome email'
      }
    }).populate('projeto').exec();

    res.status(200).json(team ? team : { message: TIME_NAO_ENCONTRADO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Cria um novo time
async function createTeam(req, res) {
  const team = montaJsonTeam(req, res);

  try {
    const newTeam = await team.save();

    res.status(201).json(newTeam);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

// Deleta um determinado time a partir do id
async function deleteTeamById(req, res) {
  const teamId = req.params.id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      console.log(error);
      return res.status(404).json({ message: TIME_NAO_ENCONTRADO });
    }

    await Team.deleteOne({ _id: teamId });

    res.status(200).json({ message: TIME_EXCLUIDO_COM_SUCESSO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Atualiza um time por id
async function updateTeamById(req, res) {
  const teamId = req.params.id;

  try {
    let team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: TIME_NAO_ENCONTRADO });
    }

    // Atualiza os dados do time com os dados do corpo da requisição
    // Aqui você pode especificar quais campos do time podem ser atualizados
    team.nome = req.body.nome;
    team.membros = req.body.membros;
    team.comunicacao = req.body.comunicacao;
    team.projeto = req.body.projeto;
    team.status = req.body.status;

    team = await team.save();

    res.status(200).json(team);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}


// Monta uma instância de Time com as propriedades vindas do body do json da request
function montaJsonTeam(req, res) {
  const {
    nome,
    membros
  } = req.body;

  return new Team({
    nome,
    membros
  });
}

module.exports = {
  getAllTeams,
  createTeam,
  deleteTeamById,
  getTeamById,
  updateTeamById,  
};
