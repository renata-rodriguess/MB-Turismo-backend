class TrilhaDTO {
    constructor(data) {
        data = data && typeof data === 'object' ? data : {};

        this.pontoTuristico = data.pontoTuristico;
        this.nome = typeof data.nome === 'string' ? data.nome.trim() : '';
        this.descricao = typeof data.descricao === 'string' ? data.descricao.trim() : '';
        this.dificuldade = data.dificuldade || 'Médio';
    }

    validar() {
        const erros = [];

        if (!this.pontoTuristico) {
            erros.push('Selecione o ponto turístico');
        }

        if (this.nome.length < 3) {
            erros.push('Nome da trilha: mínimo 3 caracteres');
        }

        if (this.descricao.length < 5) {
            erros.push('Descrição: mínimo 5 caracteres');
        }

        if (!['Fácil', 'Médio', 'Difícil'].includes(this.dificuldade)) {
            erros.push('Dificuldade inválida');
        }

        return erros;
    }
}

module.exports = TrilhaDTO;
