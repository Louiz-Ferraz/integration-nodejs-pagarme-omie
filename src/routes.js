const express = require('express');
const transactionsController = require('./controllers/transactions');
const serviceOrderController = require('./controllers/serviceOrders');
const departmentsController = require('./controllers/departments');
const clientsController = require('./controllers/clients');
const accountsReceivableController = require('./controllers/accountsReceivable');
const accountsPayableController = require('./controllers/accountsPayable');
const financasController = require('./controllers/financas');
const accountsController = require('./controllers/accounts');
const contractsController = require('./controllers/contracts');

const routes = express();

routes.get('/transactions/:id', transactionsController.getTransaction);
routes.get('/transactions', transactionsController.getAllTransactions);
routes.get('/transactions/:id/payables', transactionsController.getPayablesTransaction);

routes.get('/service-order/:id', serviceOrderController.getServiceOrder);
routes.post('/service-order', serviceOrderController.postServiceOrder);

routes.get('/departments', departmentsController.getAllDepartments);

routes.get('/clients/:cpf', clientsController.getClient);
routes.get('/all-clients', clientsController.getAllClients);

routes.get('/accounts-receivable/:id', accountsReceivableController.getAccountsReceivable);
routes.get('/all-accounts-receivable', accountsReceivableController.getAllAccountsReceivable);
routes.get('/all-accounts-receivable-two', accountsReceivableController.getAllAccountsReceivableTwo);
routes.patch('/accounts-receivable/department', accountsReceivableController.addDepartmentToAccountsReceivable);
routes.patch('/accounts-receivable/patch', accountsReceivableController.patchAccountsReceivable);
routes.delete('/accounts-receivable/delete/baixa', accountsReceivableController.deleteBaixa);
routes.post('/accounts-receivable/baixa', accountsReceivableController.addBaixaAccountsReceivable);
routes.post('/accounts-receivable/baixa-discount', accountsReceivableController.addBaixaDiscountAccountsReceivable);

routes.get('/baixas', financasController.getBaixas);
routes.get('/baixas-complete', financasController.getBaixasComplete);

routes.get('/all-accounts', accountsController.getAllAccounts);

routes.get('/all-accounts-payable', accountsPayableController.getAllAccountsPayable);
routes.delete('/accounts-payable/delete/baixa', accountsPayableController.deleteBaixaAccountsPayable);
routes.patch('/accounts-payable/patch', accountsPayableController.patchAccountsPayable);
routes.post('/accounts-payable/baixa', accountsPayableController.addBaixaAccountsPayable);

routes.get('/contracts', contractsController.getAllContracts);
routes.patch('/contracts/patch', contractsController.patchContracts);

module.exports = routes;