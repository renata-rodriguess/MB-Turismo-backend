const AvaliacaoDTO = require('../dto/AvaliacaoDTO');
const repository = require('../repositories/AvaliacaoRepository');

class AvaliacaoController {
    async enviar(req, res) {
        try {
            if (!req.usuario) {
                return res.status(401).json({
                    mensagem: 'Autenticação necessária'
                });
            }

            const dto = new AvaliacaoDTO(req.body);
            const erros = dto.validar();

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dadosAvaliacao = {
                nomeUsuario: req.usuario.nomeUsuario,
                comentario: dto.comentario,
                nota: dto.nota,
                pontoTuristico: dto.pontoTuristico
            };

            const avaliacao = await repository.criar(dadosAvaliacao);

            return res.status(201).json({
                mensagem: 'Avaliação enviada com sucesso',
                avaliacao
            });
        } catch (erro) {
            console.error('Erro ao enviar avaliação:', erro.stack || erro);

            if (erro.name === 'ValidationError' || erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Dados da avaliação inválidos'
                });
            }

            return res.status(500).json({
                mensagem: 'Não foi possível enviar a avaliação'
            });
        }
    }

    async listarAprovadas(req, res) {
        try {
            const resultado = await repository.listarAprovadas(
                req.params.pontoId
            );

            return res.status(200).json(resultado);
        } catch (erro) {
            console.error('Erro ao listar avaliações:', erro.stack || erro);

            if (erro.status === 400 || erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador do ponto turístico inválido'
                });
            }

            return res.status(500).json({
                mensagem: 'Não foi possível buscar as avaliações'
            });
        }
    }

    async listarPendentes(req, res) {
        try {
            const avaliacoes = await repository.listarPendentes();

            return res.status(200).json(avaliacoes);
        } catch (erro) {
            console.error('Erro ao listar avaliações pendentes:', erro.stack || erro);

            return res.status(500).json({
                mensagem: 'Não foi possível buscar as avaliações pendentes'
            });
        }
    }

    async aprovar(req, res) {
        try {
            const avaliacao = await repository.aprovar(req.params.id);

            if (!avaliacao) {
                return res.status(404).json({
                    mensagem: 'Avaliação não encontrada'
                });
            }

            return res.status(200).json({
                mensagem: 'Avaliação aprovada com sucesso',
                avaliacao
            });
        } catch (erro) {
            console.error('Erro ao aprovar avaliação:', erro.stack || erro);

            if (erro.status === 400 || erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador da avaliação inválido'
                });
            }

            return res.status(500).json({
                mensagem: 'Não foi possível aprovar a avaliação'
            });
        }
    }
}

module.exports = new AvaliacaoController();
