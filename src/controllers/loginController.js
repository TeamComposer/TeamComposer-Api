const User = require('../models/userModel');
const Aluno = require('../models/alunoModel');

module.exports = {
    //Retorna dados de um usuário e um aluno, caso o usuário seja um aluno
    async login(req, res) {
        const { email, senha } = req.body;
        try {
            const dbUser = await User.findOne({ email });
            if (!dbUser) {
                return res.status(400).send('Usuário não encontrado');
            } else {
                if (dbUser.senha === senha) {
                    if (dbUser.papel === 'Aluno') {
                        const dbAluno = await Aluno.findOne({ userId: dbUser._id });
                        if (!dbAluno) {
                            return res.status(404).send('Dados do aluno não encontrados');
                        }
                        return res.status(200).json({ user: dbUser, aluno: dbAluno });
                    } else {
                        return res.status(200).json(dbUser);
                    }
                } else {
                    return res.status(401).send('Senha incorreta');
                }
            }
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    },
};