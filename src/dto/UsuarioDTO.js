class UsuarioDTO {
    constructor(data) {
        data = data && typeof data === 'object' ? data : {};

        this.nomeUsuario = typeof data.nomeUsuario === 'string'
            ? data.nomeUsuario.trim()
            : '';

        this.senha = typeof data.senha === 'string'
            ? data.senha
            : '';
    }

    validarCadastro() {
        const erros = [];

        if (this.nomeUsuario.length < 3) {
            erros.push('Nome de usuário: mínimo 3 caracteres');
        }

        if (this.senha.length < 6) {
            erros.push('Senha: mínimo 6 caracteres');
        }

        return erros;
    }

    validarLogin() {
        const erros = [];

        if (!this.nomeUsuario) {
            erros.push('Digite seu usuário');
        }

        if (!this.senha) {
            erros.push('Digite sua senha');
        }

        return erros;
    }
}

module.exports = UsuarioDTO;
