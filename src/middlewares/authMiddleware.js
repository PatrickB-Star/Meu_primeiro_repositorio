const jwt = require('jsonwebtoken');

// Verifica se o usuário está logado através do cookie
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Salva { id, email, role } na requisição
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// Middleware que exige nível mínimo: Pleno ou Senior
exports.requirePlenoOrSenior = (req, res, next) => {
    if (req.user.role === 'pleno' || req.user.role === 'senior') {
        return next();
    }
    return res.status(403).send('Acesso Negado: Esta página exige nível Pleno ou Sênior.');
};

// Middleware que exige nível estrito: Senior
exports.requireSenior = (req, res, next) => {
    if (req.user.role === 'senior') {
        return next();
    }
    return res.status(403).send('Acesso Negado: Esta página exige nível Sênior.');
};