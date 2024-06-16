const User = require("../models/User");
const Aluno = require("../models/Aluno");

module.exports = {
    async cadastroUserAluno(req, res){
        const {primeiroNome, sobrenome, email, periodo, senha} = req.body;

        new User({
            primeiroNome,
            sobrenome,
            email,
            periodo,
            senha
        }).save().then(() => {
            res.status(200).send('Usuário cadastrado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },

    async cadastroAluno(req, res){
        const {userId, funcao, nivel} = req.body;
        new Aluno({
            userId,
            funcao,
            nivel
        }).save().then(() => {
            res.status(200).send('Aluno cadastrado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },
    async cadastroProfessor(req, res){
        const papel = 'Professor';
        const {primeiroNome, sobrenome, email, senha} = req.body;
        new User({
            primeiroNome,
            sobrenome,
            email,
            senha,
            papel
        }).save().then(() => {
            res.status(200).send('Professor cadastrado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },
};