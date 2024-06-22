import express from 'express';
import users from './userRoute.js';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // O token pode vir com o prefixo "Bearer "
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

const routes = (app) => {
  app.route('/').get(verifyToken,(req, res) => res.status(200).send('Rota de teste.'));

  app.use(express.json(), users);
};

export default routes;
