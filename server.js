const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const sequelize = require('./src/config/database'); // Importa a conexão do banco
require('dotenv').config();

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middlewares Globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rotas do sistema
app.use('/', authRoutes);
app.get('/', (req, res) => res.redirect('/login'));

const PORT = process.env.PORT || 3000;

// COMANDO ESSENCIAL: Conecta ao MySQL e cria a tabela 'usuarios' se ela não existir
sequelize.sync({ force: false })
    .then(() => {
        console.log('📌 MySQL conectado com sucesso e tabelas prontas via Sequelize!');
        app.listen(PORT, () => console.log(`🚀 Sistema rodando em http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ Erro crítico: O Node não conseguiu conectar ao MySQL.', err.message);
        console.log('💡 Dica: Verifique se o MySQL está ligado e se a senha no arquivo .env está correta.');
    });