const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Agora funciona perfeitamente, pois o 'fs' e 'path' foram importados nas linhas 1 e 2
const bootstrapCSS = fs.readFileSync(path.join(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'), 'utf8');

// Renderização das telas via EJS enviando o Bootstrap injetado
exports.getRegisterPage = (req, res) => res.render('cadastro', { error: null, bootstrapCSS });
exports.getLoginPage = (req, res) => res.render('login', { error: null, bootstrapCSS });
exports.getDashboardPage = (req, res) => res.render('dashboard', { user: req.user, bootstrapCSS });
exports.getPlenoPage = (req, res) => res.render('pagina-pleno', { user: req.user, bootstrapCSS });
exports.getSeniorPage = (req, res) => res.render('pagina-senior', { user: req.user, bootstrapCSS });

exports.register = async (req, res) => {
    try {
        const { email, senha, pergunta1, pergunta2 } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.render('cadastro', { error: 'Este e-mail já está cadastrado.', bootstrapCSS });

        let acertos = 0;
        if (pergunta1.trim().toLowerCase() === 'ejs') acertos += 1;
        if (pergunta2.trim().toLowerCase() === 'bcrypt' || pergunta2.trim().toLowerCase() === 'bcryptjs') acertos += 1;

        let roleFinal = 'junior';
        if (acertos === 1) roleFinal = 'pleno';
        else if (acertos === 2) roleFinal = 'senior';

        const hashedPassword = await bcrypt.hash(senha, 10);
        await User.create({ email, senha: hashedPassword, role: roleFinal });

        res.redirect('/login');
    } catch (error) {
        res.render('cadastro', { error: 'Erro interno ao processar o cadastro.', bootstrapCSS });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.render('login', { error: 'E-mail ou senha incorretos.', bootstrapCSS });

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return res.render('login', { error: 'E-mail ou senha incorretos.', bootstrapCSS });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('/dashboard');
    } catch (error) {
        res.render('login', { error: 'Erro interno ao tentar logar.', bootstrapCSS });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};