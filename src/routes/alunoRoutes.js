// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

router.get("/", alunoController.getAllAlunos);
router.get("/:id", alunoController.getAlunoById);
router.get("/:userId", alunoController.getAlunoByUserId);

router.delete("/:id", alunoController.deleteAlunoById);

router.put("/:id", alunoController.updateAlunoById);

module.exports = router;
