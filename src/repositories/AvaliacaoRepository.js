const mongoose = require('mongoose');
const Avaliacao = require('../models/Avaliacao');

class AvaliacaoRepository {
    async criar(dados) {
        return Avaliacao.create(dados);
    }

    async listarAprovadas(pontoId) {
        if (!mongoose.Types.ObjectId.isValid(pontoId)) {
            const erro = new Error('Identificador do ponto turístico inválido');
            erro.status = 400;
            throw erro;
        }

        const pontoTuristico = new mongoose.Types.ObjectId(pontoId);

        const [lista, resultadoMedia] = await Promise.all([
            Avaliacao.find({
                pontoTuristico,
                aprovado: true
            })
                .sort({ createdAt: -1 })
                .select('-__v'),

            Avaliacao.aggregate([
                {
                    $match: {
                        pontoTuristico,
                        aprovado: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        media: {
                            $avg: '$nota'
                        }
                    }
                }
            ])
        ]);

        const media = resultadoMedia.length > 0
            ? Number(resultadoMedia[0].media.toFixed(1))
            : 0;

        return {
            lista,
            media
        };
    }

    async listarPendentes() {
        return Avaliacao.find({
            aprovado: false
        })
            .sort({ createdAt: 1 })
            .populate('pontoTuristico', 'nome')
            .select('-__v');
    }

    async aprovar(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const erro = new Error('Identificador da avaliação inválido');
            erro.status = 400;
            throw erro;
        }

        return Avaliacao.findOneAndUpdate(
            {
                _id: id,
                aprovado: false
            },
            {
                aprovado: true
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-__v');
    }
}

module.exports = new AvaliacaoRepository();
