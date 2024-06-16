const Aluno = require("../models/Aluno");

const ALUNO_NAO_ENCONTRADO = "Aluno não encontrado";
const ALUNO_EXCLUIDO_COM_SUCESSO = "Aluno deletado com sucesso!";

// Retorna todos os alunos cadastrados no banco
async function getAllAlunos(req, res) {
  try {
    const alunos = await Aluno.find();

    res.json(alunos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// Retorna um aluno por id
async function getAlunoById(req, res) {
  const alunoId = req.params.id;

  try {
    const aluno = await Aluno.findById(alunoId);

    res.status(200).json(aluno ? aluno : { message: ALUNO_NAO_ENCONTRADO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}



// Deleta um determinado aluno a partir do id
async function deleteAlunoById(req, res) {
  const alunoId = req.params.id;

  try {
    const aluno = await Aluno.findById(alunoId);

    if (!aluno) {
      console.log(error);
      return res.status(404).json({ message: ALUNO_NAO_ENCONTRADO });
    }

    await Aluno.deleteOne({ _id: aluno });

    res.json({ message: ALUNO_EXCLUIDO_COM_SUCESSO });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Atualiza um aluno por id
async function updateAlunoById(req, res) {
  const alunoId = req.params.id;

  try {
    let aluno = await Aluno.findById(alunoId);

    if (!aluno) {
      return res.status(404).json({ message: ALUNO_NAO_ENCONTRADO });
    }

    // Atualiza os dados de aluno com os dados do corpo da requisição
    // Aqui você pode especificar quais campos do aluno podem ser atualizados
    aluno.funcao = req.body.funcao;
    aluno.nivel = req.body.nivel;
    aluno.time = req.body.time;

    aluno = await aluno.save();

    res.status(204).json(aluno);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Monta uma instância de Aluno com as propriedades vindas do body do json da request
function montaJsonAluno(req, res) {
  const { userId, funcao, nivel} = req.body;

  return new Aluno({  userId, funcao, nivel });
}

module.exports = {
  getAllAlunos,
  getAlunoById,
  deleteAlunoById,
  updateAlunoById,
  montaJsonAluno
};
