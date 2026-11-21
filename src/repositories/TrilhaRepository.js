const Trilha = require('../models/Trilha');

class TrilhaRepository {
    async criar(dados) {
        return Trilha.create({
            pontoTuristico: dados.pontoTuristico,
            nome: dados.nome,
            descricao: dados.descricao,
            dificuldade: dados.dificuldade
        });
    }

    async buscarPorPontoTuristico(pontoId) {
        return Trilha.findOne({
            pontoTuristico: pontoId,
            ativo: true
        }).populate('pontoTuristico', 'nome');
    }
}

module.exports = new TrilhaRepository();