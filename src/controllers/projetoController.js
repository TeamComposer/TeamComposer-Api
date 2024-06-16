const Projeto = require("../models/Projeto");

const PROJETO_NAO_ENCONTRADO = "Projeto não encontrado";
const PROJETO_DELETADO_COM_SUCESSO = "Projeto deletado com sucesso!";

// Retorna todos os projetos cadastrados no banco
async function getAllProjects(req, res) {
  try {
    const alunos = await Aluno.find();

    res.json(alunos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// Retorna um projeto por id
async function getProjetoById(req, res) {
  const projetoId = req.params.id;

  try {
    const projeto = await Projeto.findById(projetoId);

    res
      .status(200)
      .json(projeto ? projeto : { message: PROJETO_NAO_ENCONTRADO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Cria um novo projeto
async function createProjeto(req, res) {
  const projeto = montaJsonProjeto(req, res);

  try {
    const newProjeto = await projeto.save();

    res.status(201).json(newProjeto);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

// Deleta um determinado projeto a partir do id
async function deleteProjetoById(req, res) {
  const projetoId = req.params.id;

  try {
    const projeto = await Projeto.findById(projetoId);

    if (!projeto) {
      console.log(error);
      return res.status(404).json({ message: PROJETO_NAO_ENCONTRADO });
    }

    await Projeto.deleteOne({ _id: projeto });

    res.json({ message: PROJETO_DELETADO_COM_SUCESSO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Atualiza um aluno por id
async function updateProjetoById(req, res) {
  const projetoId = req.params.id;

  try {
    let projeto = await Projeto.findById(projetoId);

    if (!projeto) {
      return res.status(404).json({ message: PROJETO_NAO_ENCONTRADO });
    }

    // Atualiza os dados de projeto com os dados do corpo da requisição
    // Aqui você pode especificar quais campos do projeto podem ser atualizados
    projeto.nome = req.body.nome;
    projeto.descricao = req.body.descricao;

    projeto = await projeto.save();

    res.status(204).json(projeto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Monta uma instância de Projeto com as propriedades vindas do body do json da request
function montaJsonProjeto(req, res) {
  const { nome, descricao } =
    req.body;

  return new Projeto({
    nome,
    descricao,
  });
}

module.exports = {
  getAllProjects,
  getProjetoById,
  createProjeto,
  deleteProjetoById,
  updateProjetoById,
};
