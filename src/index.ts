import express from 'express';
import curriculumRoutes from './routes/curriculumRoutes';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000', // Origem permitida (frontend)
  credentials: true, // Permitir envio de cookies e cabeçalhos de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], // Inclua o cabeçalho personalizado
}));


// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota específica para obter o token CSRF
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Aplica as rotas protegidas por CSRF
app.use('/', csrfProtection, curriculumRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
