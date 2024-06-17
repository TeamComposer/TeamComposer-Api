const teamCompositionController = require('../controllers/teamCompositionController');
const express = require('express');
const router = express.Router();

router.get('/', teamCompositionController.teamComposition);

module.exports = router;