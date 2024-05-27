// src/controllers/userController.js
const User = require("../models/User");
const Aluno = require("../models/Aluno");
const { montaJsonAluno } = require("./alunoController");

const USUARIO_NAO_ENCONTRADO = 'Usuário não encontrado';
const USUARIO_DELETADO_COM_SUCESSO = 'Usuário deletado com sucesso!';

// Obtém todos os usuários
async function getAllUsers(req, res) {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Retorna um usuário determinado através do id passado por parâmetro
async function getUserById(req, res) {
  const userId = req.params.id;
  
  try {
    const user = await User.findById(userId);

    res.status(200).json(user ? user : { message: USUARIO_NAO_ENCONTRADO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


// Cria um novo usuário
// Sempre que o papel do usuário for do tipo 'Aluno' podemos cadastrar
// o usuário como Aluno, ao mesmo tempo em que cadastra o usuário.
async function createUser(req, res) {
  const user = montaJsonUser(req, res);

  const { papel } = user;

  try {
    if (papel === 'Aluno') {
      const aluno = montaJsonAluno(req, res);

      await aluno.save();
    }

    const newUser = await user.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

// Deleta um determinado usuário a partir do id
async function deleteUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log(error);
      return res.status(404).json({ message: USUARIO_NAO_ENCONTRADO });
    }

    await User.deleteOne({ _id: user });

    res.json({ message: USUARIO_DELETADO_COM_SUCESSO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Atualiza um usuário por id
async function updateUserById(req, res) {
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: USUARIO_NAO_ENCONTRADO });
    }

    // Atualiza os dados de usuário com os dados do corpo da requisição
    // Aqui você pode especificar quais campos de usuário podem ser atualizados
    user.nome = req.body.nome;
    user.email = req.body.periodo;
    user.papel = req.body.papel;
    user.periodo = req.body.periodo;

    user = await user.save();

    res.status(204).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Monta uma instância de Usuário com as propriedades vindas do body do json da request
function montaJsonUser(req, res) {
  const { nome, email, papel, periodo } = req.body;

  return new User({ nome, email, papel, periodo });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
};
