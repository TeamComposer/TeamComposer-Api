// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);

router.delete('/:id', teamController.deleteTeamById);

router.post('/', teamController.createTeam);

router.put('/:id', teamController.updateTeamById)

module.exports = router;
