const express = require('express');
const transactionsController = require('./controllers/transactions');

const routes = express();

routes.get('/transactions/:id', transactionsController.getTransaction);
routes.get('/transactions', transactionsController.getAllTransactions);
routes.get('/transactions/:id/payables', transactionsController.getPayablesTransaction);

module.exports = routes;