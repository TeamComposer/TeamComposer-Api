// index.js
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/userRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const alunoRoutes = require("./src/routes/alunoRoutes");
const projetoRoutes = require("./src/routes/projetoRoutes");
const cadastroRoutes = require("./src/routes/cadastroRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://teamcomposer:teamcomposer@cluster0.c6w7arw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao banco de dados MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

app.use(express.json());

app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/alunos", alunoRoutes);
app.use("/projetos", projetoRoutes);
app.use("/cadastro", cadastroRoutes);

app.get("/", (req, res) => {
  res.send("API TeamComposer!");
});

app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});
