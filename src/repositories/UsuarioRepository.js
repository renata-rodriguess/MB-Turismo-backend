const Usuario = require('../models/Usuario');

class UsuarioRepository {
    async criar(dados) {
        return Usuario.create({
            nomeUsuario: dados.nomeUsuario,
            senha: dados.senha,
            perfil: 'usuario'
        });
    }

    async buscarPorNome(nomeUsuario) {
        return Usuario.findOne({
            nomeUsuario: nomeUsuario.trim()
        });
    }

    async buscarParaLogin(nomeUsuario) {
        return Usuario.findOne({
            nomeUsuario: nomeUsuario.trim()
        }).select('+senha');
    }
}

module.exports = new UsuarioRepository();
