// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const projetoController = require("../controllers/projetoController");

router.get("/", projetoController.getAllProjects);
router.get("/:id", projetoController.getProjetoById);

router.delete("/:id", projetoController.deleteProjetoById);

router.post("/", projetoController.createProjeto);

router.put("/:id", projetoController.updateProjetoById);

module.exports = router;
