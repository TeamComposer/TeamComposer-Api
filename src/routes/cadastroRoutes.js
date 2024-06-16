const express = require("express");
const router = express.Router();
const cadastroController = require("../controllers/cadastroController");

router.post("/cadastroUser", cadastroController.cadastroUserAluno);
router.post("/cadastroAluno", cadastroController.cadastroAluno);
router.post("/cadastroProfessor", cadastroController.cadastroProfessor);

module.exports = router;