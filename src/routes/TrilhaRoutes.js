const express = require('express');
const controller = require('../controllers/TrilhaController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/', autenticar, exigirAdmin, controller.criar);

router.get('/ponto/:pontoId', controller.buscarPorPonto);

module.exports = router;