const PontoTuristicoDTO = require('../dto/PontoTuristicoDTO');
const repository = require('../repositories/PontoTuristicoRepository');

class PontoTuristicoController {
    async criar(req, res) {
        try {
            const dto = new PontoTuristicoDTO(req.body);
            const erros = dto.validar();

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const ponto = await repository.criar(dto);

            return res.status(201).json(ponto);
        } catch (erro) {
            console.error('Erro ao cadastrar ponto turístico:', erro.stack || erro);

            if (erro.name === 'ValidationError') {
                return res.status(400).json({
                    mensagem: 'Dados do ponto turístico inválidos'
                });
            }

            if (erro.code === 11000) {
                return res.status(409).json({
                    mensagem: 'Já existe um ponto turístico com esses dados'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro interno'
            });
        }
    }

    async buscar(req, res) {
        try {
            const nome = typeof req.query.nome === 'string'
                ? req.query.nome.trim()
                : '';

            const pontos = nome
                ? await repository.buscarporNome(nome)
                : await repository.listarTodos();

            return res.status(200).json(pontos);
        } catch (erro) {
            console.error('Erro ao buscar pontos turísticos:', erro.stack || erro);

            return res.status(500).json({
                mensagem: 'Erro interno'
            });
        }
    }

    async detalhes(req, res) {
        try {
            const ponto = await repository.buscarPorId(req.params.id);

            if (!ponto) {
                return res.status(404).json({
                    mensagem: 'Ponto não encontrado'
                });
            }

            return res.status(200).json(ponto);
        } catch (erro) {
            console.error('Erro ao buscar detalhes do ponto:', erro.stack || erro);

            if (erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador do ponto turístico inválido'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro interno'
            });
        }
    }

    async atualizar(req, res) {
        try {
            const corpo = req.body && typeof req.body === 'object'
                ? req.body
                : {};

            const dados = {};

            for (const campo of ['nome', 'descricao', 'imagem', 'categoria']) {
                if (corpo[campo] !== undefined) {
                    if (typeof corpo[campo] !== 'string') {
                        return res.status(400).json({
                            mensagem: `O campo ${campo} deve ser um texto`
                        });
                    }

                    dados[campo] = corpo[campo].trim();
                }
            }

            if (Object.keys(dados).length === 0) {
                return res.status(400).json({
                    mensagem: 'Informe pelo menos um campo para atualizar'
                });
            }

            const ponto = await repository.atualizar(
                req.params.id,
                dados
            );

            if (!ponto) {
                return res.status(404).json({
                    mensagem: 'Ponto não encontrado'
                });
            }

            return res.status(200).json(ponto);
        } catch (erro) {
            console.error('Erro ao atualizar ponto turístico:', erro.stack || erro);

            if (erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador do ponto turístico inválido'
                });
            }

            if (erro.name === 'ValidationError') {
                return res.status(400).json({
                    mensagem: 'Dados do ponto turístico inválidos'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro interno'
            });
        }
    }

    async excluir(req, res) {
        try {
            const ponto = await repository.excluir(req.params.id);

            if (!ponto) {
                return res.status(404).json({
                    mensagem: 'Ponto turístico não encontrado'
                });
            }

            return res.status(200).json({
                mensagem: 'Ponto turístico excluído com sucesso'
            });
        } catch (erro) {
            console.error('Erro ao excluir ponto turístico:', erro.stack || erro);

            if (erro.name === 'CastError') {
                return res.status(400).json({
                    mensagem: 'Identificador inválido'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = new PontoTuristicoController();
