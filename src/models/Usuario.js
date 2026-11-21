const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nomeUsuario: {
        type: String,
        required: [true, 'Nome de usuário é obrigatório'],
        trim: true,
        minlength: [3, 'Mínimo 3 caracteres'],
        unique: true
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Mínimo 6 caracteres'],
        select: false
    },
    perfil: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

usuarioSchema.pre('save', async function () {
    if (!this.isModified('senha')) return;
    this.senha = await bcrypt.hash(this.senha, 12);
});

usuarioSchema.methods.compararSenha = async function (senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
