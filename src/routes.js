const express = require('express');
const transactionsController = require('./controllers/transactions');

const routes = express();

routes.get('/transactions/:id', transactionsController.getTransaction);
routes.post('/transactions', transactionsController.createTransaction);

module.exports = routes;