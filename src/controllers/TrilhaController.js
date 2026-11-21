const TrilhaDTO = require('../dto/TrilhaDTO');
const repository = require('../repositories/TrilhaRepository');

class TrilhaController {
    async criar(req, res) {
        try {
            const dto = new TrilhaDTO(req.body);
            const erros = dto.validar();

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const trilha = await repository.criar(dto);

            return res.status(201).json(trilha);
        } catch (erro) {
            console.error('Erro ao cadastrar trilha:', erro.stack || erro);

            if (erro.code === 11000) {
                return res.status(409).json({
                    mensagem: 'Esse ponto já tem uma trilha'
                });
            }

            if (erro.name === 'CastError' || erro.name === 'ValidationError') {
                return res.status(400).json({
                    mensagem: 'Dados da trilha inválidos'
                });
            }

            return res.status(500).json({
                mensagem: 'Não foi possível cadastrar a trilha'
            });
        }
    }

    async buscarPorPonto(req, res) {
        try {
            const trilha = await repository.buscarPorPontoTuristico(
                req.params.pontoId
            );

            if (!trilha) {
                return res.status(404).json({
                    mensagem: 'Trilha não encontrada'
                });
            }

            return res.status(200).json(trilha);
        } catch (erro) {
            console.error('Erro ao buscar trilha:', erro.stack || erro);

            if (erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador do ponto turístico inválido'
                });
            }

            return res.status(500).json({
                mensagem: 'Não foi possível buscar a trilha'
            });
        }
    }
}

module.exports = new TrilhaController();