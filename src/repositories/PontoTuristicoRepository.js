const PontoTuristico = require('../models/PontoTuristico');

class PontoTuristicoRepository {
    async criar(dados) {
        return await PontoTuristico.create(dados);
    }

    async listarTodos() {
        return await PontoTuristico.find({ ativo: true }).sort({ nome: 1 });
    }

    async buscarporNome(nome) {
        return await PontoTuristico.find({
            nome: { $regex: nome, $options: 'i' },
            ativo: true
        });
    }

    async buscarPorId(id) {
        return await PontoTuristico.findOne({
            _id: id,
            ativo: true
        });
    }

    async excluir(id) {
        return await PontoTuristico.findOneAndUpdate(
            { _id: id, ativo: true },
            { ativo: false },
            { new: true }
        );
    }
}

module.exports = new PontoTuristicoRepository();
