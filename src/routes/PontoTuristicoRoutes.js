const express = require('express');
const router = express.Router();

const controller = require('../controllers/PontoTuristicoController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

router.get('/', (req, res) => {
    controller.buscar(req, res);
});

router.get('/:id', (req, res) => {
    controller.detalhes(req, res);
});

router.post('/', autenticar, exigirAdmin, (req, res) => {
    controller.criar(req, res);
});

router.patch('/:id', autenticar, exigirAdmin, (req, res) => {
    controller.atualizar(req, res);
});

router.delete('/:id', autenticar, exigirAdmin, (req, res) => {
    controller.excluir(req, res);
});

module.exports = router;
