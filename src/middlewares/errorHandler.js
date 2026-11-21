function errorHandler(err, req, res, next) {
    console.error('Erro na API:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            mensagem: 'O corpo da requisição contém JSON inválido'
        });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            mensagem: 'O conteúdo enviado é muito grande'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            mensagem: 'Dados inválidos',
            erros: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            mensagem: 'Identificador inválido'
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            mensagem: 'Já existe um registro com esses dados'
        });
    }

    const status = Number.isInteger(err.status)
        ? err.status
        : 500;

    if (status >= 400 && status < 500) {
        return res.status(status).json({
            mensagem: 'Não foi possível processar a solicitação'
        });
    }

    return res.status(500).json({
        mensagem: 'Erro interno do servidor'
    });
}

module.exports = errorHandler;
