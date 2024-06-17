const Aluno = require('../models/Aluno');
const Team = require('../models/Team');
const _ = require('lodash');

const numeroEquipes = 3;

async function gerarTime(tamanho) {
    try {
        const alunos = await Aluno.find({ time: null });
        const alunosData = alunos.map(aluno => {
            let increment = 0;
            if (aluno.nivel === 0) {
                increment = 1;
            }
            const novoNivel = aluno.nivel + increment;
            return {
                id: aluno._id,
                funcao: aluno.funcao,
                nivel: novoNivel,
            };
        });

        const funcoesMapeadas = {
            Frontend: alunosData.filter(aluno => aluno.funcao === 'Frontend'),
            Backend: alunosData.filter(aluno => aluno.funcao === 'Backend'),
            FullStack: alunosData.filter(aluno => aluno.funcao === 'FullStack'),
            PM: alunosData.filter(aluno => aluno.funcao === 'PM'),
            UXUI: alunosData.filter(aluno => aluno.funcao === 'UX/UI'),
            QA: alunosData.filter(aluno => aluno.funcao === 'QA')
        };

        // Log the mapped roles to ensure there are available students
        console.log('Funções mapeadas:', funcoesMapeadas);

        // Check if there are any roles without available students
        const missingRoles = Object.keys(funcoesMapeadas).filter(role => funcoesMapeadas[role].length === 0);
        if (missingRoles.length > 0) {
            console.error(`Não há alunos disponíveis para as seguintes funções: ${missingRoles.join(', ')}`);
            throw new Error(`Funções ausentes: ${missingRoles.join(', ')}`);
        }

        let time = [
            _.sample(funcoesMapeadas.Frontend), _.sample(funcoesMapeadas.Backend),
            _.sample(funcoesMapeadas.UXUI), _.sample(funcoesMapeadas.QA),
            _.sample(funcoesMapeadas.FullStack), _.sample(funcoesMapeadas.PM)
        ].filter(Boolean); // Filter out any undefined samples

        if (time.length < 6) {
            throw new Error('Não foi possível formar um time inicial com todas as funções necessárias.');
        }

        const funcoes = ['Frontend', 'Backend', 'FullStack', 'PM', 'UXUI', 'QA'];
        let num_juniors = time.filter(m => m.nivel === 1).length;

        for (let i = 0; i < tamanho - 6; i++) {
            const prob_junior = Math.pow((num_juniors / (i + 6)), 2);
            let funcao;
            if (Math.random() < prob_junior) {
                funcao = _.sample(funcoes.filter(p => funcoesMapeadas[p] && funcoesMapeadas[p].some(m => m.nivel === 1)));
            } else {
                funcao = _.sample(funcoes);
            }

            const membro = _.sample(funcoesMapeadas[funcao].filter(m => !time.includes(m)));
            if (membro) {
                time.push(membro);
                if (membro.nivel === 1) num_juniors++;
            } else {
                console.error('Não foi possível encontrar um membro válido para adicionar ao time.');
            }
        }

        while (_.uniqBy(time, 'id').length < tamanho) {
            time = [
                _.sample(funcoesMapeadas.Frontend), _.sample(funcoesMapeadas.Backend),
                _.sample(funcoesMapeadas.UXUI), _.sample(funcoesMapeadas.QA),
                _.sample(funcoesMapeadas.FullStack), _.sample(funcoesMapeadas.PM)
            ].filter(Boolean);

            if (time.length < 6) {
                throw new Error('Não foi possível formar um time inicial com todas as funções necessárias.');
            }

            num_juniors = time.filter(m => m.nivel === 1).length;
            for (let i = 0; i < tamanho - 6; i++) {
                const prob_junior = Math.pow((num_juniors / (i + 6)), 2);
                let funcao;
                if (Math.random() < prob_junior) {
                    funcao = _.sample(funcoes.filter(p => funcoesMapeadas[p].some(m => m.nivel === 1)));
                } else {
                    funcao = _.sample(funcoes);
                }
                const membro = _.sample(funcoesMapeadas[funcao].filter(m => !time.includes(m)));
                if (membro) {
                    time.push(membro);
                    if (membro.nivel === 1) num_juniors++;
                }
            }
        }

        const timeGerado = time.map(m => ({ id: m.id, funcao: m.funcao, nivel: m.nivel }));
        return timeGerado;
    } catch (error) {
        console.error('Erro ao compor equipes:', error);
        throw error; // Re-throw the error after logging it
    }
}

async function expandirVizinhanca(time) {
    const alunos = await Aluno.find({ time: null });
    const alunosData = alunos.map(aluno => {
        let increment = 0;
        if (aluno.nivel === 0) {
            increment = 1;
        }
        const novoNivel = aluno.nivel + increment;
        return {
            id: aluno._id,
            funcao: aluno.funcao,
            nivel: novoNivel,
        };
    });

    const timesExpandidos = [];
    for (let i = 0; i < 4; i++) {
        const novoTime = time.map(membro => ({
            id: membro.id,
            funcao: membro.funcao,
            nivel: membro.nivel,
        }));

        const pessoaOrig = _.sample(novoTime);
        const funcao = pessoaOrig.funcao;

        const candidatos = alunosData.filter(d => d.funcao === funcao && d.id !== pessoaOrig.id);

        if (!candidatos.length) {
            timesExpandidos.push(novoTime);
            continue;
        }

        while (true) {
            const pessoaNova = _.sample(candidatos);
            if (!novoTime.some(p => p.id === pessoaNova.id)) {
                novoTime[novoTime.indexOf(pessoaOrig)] = pessoaNova;
                timesExpandidos.push([...novoTime]);
                break;
            }
        }
    }
    return timesExpandidos;
}

function avaliarBalanceamento(times) {
    const resultados = {};
    times.forEach((time, i) => {
        const niveis = { junior: 0, pleno: 0, senior: 0 };

        if (!Array.isArray(time)) {
            console.error(`O elemento na posição ${i} não é uma matriz válida.`);
            resultados[i] = 0;
            return;
        }

        time.forEach(membro => {
            if (membro.nivel === 1) niveis.junior++;
            else if (membro.nivel === 2) niveis.pleno++;
            else if (membro.nivel === 3) niveis.senior++;
        });

        const juniorPercent = niveis.junior / time.length;

        let avaliacao;
        if (niveis.junior === time.length) {
            avaliacao = 1;
        } else if (juniorPercent > 0.5) {
            avaliacao = 0.5 * (10 - Math.abs(niveis.junior - niveis.pleno) - Math.abs(niveis.junior - niveis.senior) - Math.abs(niveis.pleno - niveis.senior));
        } else {
            avaliacao = 10 - Math.abs(niveis.junior - niveis.pleno) - Math.abs(niveis.junior - niveis.senior) - Math.abs(niveis.pleno - niveis.senior);
            if (niveis.pleno >= niveis.junior && niveis.senior >= niveis.junior) {
                avaliacao *= 1.2;
            } else if (niveis.junior === niveis.pleno + niveis.senior) {
                avaliacao *= 1.3;
            }
        }

        resultados[i] = avaliacao;
    });
    return resultados;
}

function selecionarMelhorTime(timeInicial, timesExpandidos) {
    const indiceInicial = Object.values(avaliarBalanceamento([timeInicial]))[0];
    let melhorTime = timeInicial;
    let melhorIndice = indiceInicial;

    timesExpandidos.forEach(time => {
        const indiceTime = Object.values(avaliarBalanceamento([time]))[0];
        if (indiceTime > melhorIndice) {
            melhorTime = time;
            melhorIndice = indiceTime;
            console.log(`        Nova melhor solução: ${JSON.stringify(melhorTime)}`);
        }
    });
    return melhorTime;
}

async function executarAlgoritmo(tamanho) {
    const timeInicial = await gerarTime(tamanho);
    let melhorSolucao = timeInicial;
    let melhorIndice = Object.values(avaliarBalanceamento([melhorSolucao]))[0];
    console.log(`Valor de avaliação da solução inicial: ${melhorIndice}`);

    for (let i = 1; i < 50; i++) {
        console.log(`Iteração ${i}`);
        const timesExpandidos = await expandirVizinhanca(melhorSolucao);
        const melhorTime = selecionarMelhorTime(melhorSolucao, timesExpandidos);
        const novoIndice = Object.values(avaliarBalanceamento([melhorTime]))[0];
        if (novoIndice > melhorIndice) {
            melhorSolucao = melhorTime;
            melhorIndice = novoIndice;
            console.log(`Melhor solução encontrada: ${JSON.stringify(melhorSolucao)}`);
            console.log(`Valor de avaliação da melhor solução: ${melhorIndice}`);
        } else {
            console.log("Nenhuma melhoria encontrada");
        }
    }

    console.log(`Melhor solução global encontrada: ${JSON.stringify(melhorSolucao)}`);
    console.log(`Valor de avaliação da melhor solução: ${melhorIndice}`);
    return melhorSolucao;
}

async function gerarTimeReserva(){
    const remainingAlunos = await Aluno.find({ time: null });
    if (remainingAlunos.length > 0) {
        const reserveTeam = new Team({
            nome: 'Time Reserva',
            membros: remainingAlunos.map(aluno => ({
                id: aluno._id
            }))
        });

        await reserveTeam.save();
        const reserveTeamId = reserveTeam._id;
        await Aluno.updateMany({ _id: { $in: remainingAlunos.map(m => m._id) } }, { time: reserveTeamId });
        console.log('Time Reserva gerado com sucesso');
    }
}

module.exports = {
    async teamComposition(req, res) {
        try {
            const count = await Aluno.find({ time: null }).countDocuments();
            const alunosSemTime = await Aluno.find({ time: null });
            let tamanho = Math.floor(count / numeroEquipes);
            let errors = [];

            for (let z = 0; z < numeroEquipes; z++) {
                if (z === numeroEquipes - 1) {
                    tamanho = await Aluno.find({ time: null }).countDocuments();
                }

                try {
                    const time = await executarAlgoritmo(tamanho);
                    const membros = time.map(membro => ({ aluno: membro.id }));

                    const newTeam = new Team({
                        nome: `Time ${z + 1}`,
                        membros: membros
                    });

                    console.log("new team:  ", newTeam)

                    await newTeam.save();
                    const timeId = newTeam._id;

                    await Aluno.updateMany({ _id: { $in: time.map(m => m.id) } }, { time: timeId });

                    console.log(`Time ${z + 1} gerado com sucesso`);
                } catch (error) {
                    console.error(`Erro ao gerar Time ${z + 1}:`, error);
                    errors.push(`Erro ao gerar Time ${z + 1}: ${error.message}`);
                }
            }

            // Always generate the reserve team
            await gerarTimeReserva();

            if (errors.length > 0) {
                console.error('Erros ao compor equipes:', errors);
                res.status(200).send('Times gerados com erros: ' + errors.join(', '));
            } else {
                res.status(200).send('Times gerados com sucesso');
            }
        } catch (error) {
            console.error('Erro ao compor equipes:', error);
            res.status(500).send('Internal Server Error: ' + error.message);
        }
    }
};