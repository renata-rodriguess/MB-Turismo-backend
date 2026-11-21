const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    try {
        const autorizacao = req.headers.authorization;

        if (!autorizacao) {
            return res.status(401).json({
                mensagem: 'Autenticação necessária'
            });
        }

        const partes = autorizacao.split(' ');

        if (
            partes.length !== 2 ||
            partes[0] !== 'Bearer' ||
            !partes[1]
        ) {
            return res.status(401).json({
                mensagem: 'Token de autenticação inválido'
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                mensagem: 'Configuração de autenticação indisponível'
            });
        }

        const payload = jwt.verify(
            partes[1],
            process.env.JWT_SECRET,
            {
                algorithms: ['HS256']
            }
        );

        if (
            !payload ||
            typeof payload !== 'object' ||
            typeof payload.sub !== 'string' ||
            typeof payload.nomeUsuario !== 'string' ||
            !['usuario', 'admin'].includes(payload.perfil)
        ) {
            return res.status(401).json({
                mensagem: 'Token de autenticação inválido'
            });
        }

        req.usuario = {
            id: payload.sub,
            nomeUsuario: payload.nomeUsuario,
            perfil: payload.perfil
        };

        next();
    } catch (erro) {
        return res.status(401).json({
            mensagem: 'Sessão inválida ou expirada'
        });
    }
}

module.exports = autenticar;
