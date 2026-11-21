const express = require('express');
const { rateLimit } = require('express-rate-limit');
const controller = require('../controllers/UsuarioController');

const router = express.Router();

const limitarTentativasLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    }
});

router.post('/cadastrar', (req, res) => {
    controller.cadastrar(req, res);
});

router.post('/login', limitarTentativasLogin, (req, res) => {
    controller.login(req, res);
});

module.exports = router;
