const User = require("../models/User");
const Aluno = require("../models/Aluno");
const { faker } = require('@faker-js/faker');



module.exports = {
    async autoGenerateUserAluno(req, res) {
        const n = 100;
        const results = []; // Array para armazenar os resultados
        try {
            for (let i = 0; i < n; i++) {
                const primeiroNome = faker.person.firstName();
                const sobrenome = faker.person.lastName();
                const email = faker.internet.email();
                const periodo = 4;
                const senha = "1234";
                const newUser = new User({
                    primeiroNome,
                    sobrenome,
                    email,
                    periodo,
                    senha
                });
                await newUser.save();
                const userId = newUser._id;
                const funcao = faker.helpers.arrayElement(["Backend", "Frontend", "FullStack", "PM", "UX/UI", "QA"]);
                const nivel = faker.number.int({ max: 3 });
                const newAluno = new Aluno({
                    userId,
                    funcao,
                    nivel
                });
                await newAluno.save();
                console.log(`Usuário ${i} gerado com sucesso`);
                results.push({ user: newUser, aluno: newAluno }); // Adiciona o resultado ao array
            }
            return res.status(200).json(results); // Retorna todos os resultados após o loop
        } catch (err) {
            return res.status(500).send('Internal Server Error: ' + err);
        }
    }
};