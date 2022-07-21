const express = require('express');
const transactionsController = require('./controllers/transactions');
const serviceOrderController = require('./controllers/serviceOrders');

const routes = express();

routes.get('/transactions/:id', transactionsController.getTransaction);
routes.get('/transactions', transactionsController.getAllTransactions);
routes.get('/transactions/:id/payables', transactionsController.getPayablesTransaction);

routes.get('/service-order/:id', serviceOrderController.getServiceOrder);

module.exports = routes;