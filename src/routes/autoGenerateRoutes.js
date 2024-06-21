const autoGenerateController = require('../controllers/autoGenerateController');
const express = require("express");
const router = express.Router();

router.get("/", autoGenerateController.autoGenerateUserAluno);

module.exports = router;