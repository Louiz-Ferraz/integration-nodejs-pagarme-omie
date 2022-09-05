const express = require('express');
const transactionsController = require('./controllers/transactions');
const serviceOrderController = require('./controllers/serviceOrders');
const departmentsController = require('./controllers/departments');
const clientsController = require('./controllers/clients');

const routes = express();

routes.get('/transactions/:id', transactionsController.getTransaction);
routes.get('/transactions', transactionsController.getAllTransactions);
routes.get('/transactions/:id/payables', transactionsController.getPayablesTransaction);

routes.get('/service-order/:id', serviceOrderController.getServiceOrder);
routes.post('/service-order', serviceOrderController.postServiceOrder);

routes.get('/departments', departmentsController.getAllDepartments);

routes.get('/clients/:cpf', clientsController.getClient);

module.exports = routes;