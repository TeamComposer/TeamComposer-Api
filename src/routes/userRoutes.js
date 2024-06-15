// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.delete("/:id", userController.deleteUserById);

router.put("/:id", userController.updateUserById);

module.exports = router;
