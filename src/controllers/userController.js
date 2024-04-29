// src/controllers/userController.js
const User = require('../models/User');

// Obtém todos os usuários
async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Cria um novo usuário
async function createUser(req, res) {
  const { nome, email, papel, periodo } = req.body;
  const user = new User({ nome, email, papel, periodo });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers,
  createUser
};
