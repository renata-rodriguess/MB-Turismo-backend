const mongoose = require('mongoose');

const conectarDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('A variável MONGODB_URI não foi configurada');
    }

    try {
        await mongoose.connect(uri);
        console.log('Conectado ao MongoDB!');
    } catch (erro) {
        console.error('Erro de conexão:', erro.message);
        throw erro;
    }
};

module.exports = conectarDB;
