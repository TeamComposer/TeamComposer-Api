// src/controllers/userController.js
const Team = require('../models/Team');

// Criação de variáveis para as mensagens a fim de padronizar e deixar mais "limpo" o código,
// sem a necessidade de adicionar uma string talvez muito grande diretamente no código.
const TIME_NAO_ENCONTRADO = 'Time não encontrado';
const TIME_EXCLUIDO_COM_SUCESSO = 'Time excluído com sucesso!';

// Obtém todos os times
async function getAllTeams(req, res) {
  
  try {
    
    const teams = await Team.find();
    
    res.json(teams);
  
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
}

// Retorna um time por id
async function getTeamById(req, res) {
  const teamId = req.params.id;

  try {

    const team = await Team.findById(teamId);
    
    res.status(200).json(team ? team : { message: TIME_NAO_ENCONTRADO });

  } catch (error) {

    res.status(500).json({error: error.message});
  }
}

// Cria um novo time
async function createTeam(req, res) {
  
  const team = montaJsonTeam(req, res);

  try {
    
    const newTeam = await team.save();
    
    res.status(201).json(newTeam);
  
  } catch (error) {
    
    res.status(400).json({ message: error.message });
  }
}

// Deleta um determinado time a partir do id
async function deleteTeamById(req, res) {
  const teamId = req.params.id;

  try {
    
    const team = await Team.findById(teamId);

    if (!team) {
      
      return res.status(404).json({ message: TIME_NAO_ENCONTRADO });
    }
    
    await Team.deleteOne({ _id: teamId });

    res.json({ message: TIME_EXCLUIDO_COM_SUCESSO });

  } catch (error) {
    
    res.status(500).json({error: error.message});
  }
}

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
    team.email = req.body.email;
    team.membros = req.body.membros;
    team.comunicacao = req.body.comunicacao;
    team.projeto = req.body.projeto;
    team.descricaoProjeto = req.body.descricaoProjeto;
    team.status = req.body.status;

    team = await team.save();

    res.json(team);

  } catch (error) {
    
    res.status(500).json({error: error.message});
  }
}

function montaJsonTeam(req, res) {

  const { 
    nome, 
    email, 
    membros, 
    comunicacao, 
    projeto, 
    descricaoProjeto, 
    status 
  } = req.body;
  
  return new Team({ nome, email, membros, comunicacao, projeto, descricaoProjeto, status });
}

module.exports = {
  getAllTeams,
  createTeam,
  deleteTeamById,
  getTeamById,
  updateTeamById
};
