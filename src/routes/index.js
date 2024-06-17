import express from 'express';
import users from './userRoute.js';

const routes = (app) => {
  app.route('/').get((req, res) => res.status(200).send('Rota de teste.'));

  app.use(express.json(), users);
};

export default routes;
