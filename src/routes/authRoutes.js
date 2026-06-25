const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requirePlenoOrSenior, requireSenior } = require('../middlewares/authMiddleware');

// Rotas abertas públicas
router.get('/cadastro', authController.getRegisterPage);
router.post('/cadastro', authController.register);
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rotas protegidas por Tokens e Cargos
router.get('/dashboard', verifyToken, authController.getDashboardPage);
router.get('/pagina-pleno', verifyToken, requirePlenoOrSenior, authController.getPlenoPage);
router.get('/pagina-senior', verifyToken, requireSenior, authController.getSeniorPage);

module.exports = router;