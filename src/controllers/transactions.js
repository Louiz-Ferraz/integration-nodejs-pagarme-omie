const instanciaAxiosPagarme = require('../services/pagarme');
const { getTransactionById } = require('../services/utils/transactions');

const getTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await getTransactionById(id);
        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const getAllTransactions = async (req, res) => {
    const { status } = req.query;
    instanciaAxiosPagarme.defaults.params.status = status;

    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 90));
    instanciaAxiosPagarme.defaults.params.date_updated = `>=${+priorDate}`;

    instanciaAxiosPagarme.defaults.params.count = 1000;
    instanciaAxiosPagarme.defaults.params.page = 1;

    try {
        let transactions = await instanciaAxiosPagarme.get(`transactions`);
        let arrayTransactions = transactions.data;

        if(arrayTransactions.length >= 1000) { 
            while (transactions.data.length >= 1000) {
                instanciaAxiosPagarme.defaults.params.page++;
                transactions = await instanciaAxiosPagarme.get(`transactions`);
                for (let item of transactions.data) {
                    arrayTransactions.push(item);
                }
            }
        }

        return res.status(transactions.status).json(arrayTransactions);
    } catch (error) {
        const { status, data: { errors } } = error.response;
        return res.status(status).json(
            `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
        );
    }
}

const getPayablesTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transactions = await instanciaAxiosPagarme.get(`transactions/${id}/payables`);

        return res.status(transactions.status).json(transactions.data);
    } catch (error) {
        const { status, data: { errors } } = error.response;
        return res.status(status).json(
            `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
        );
    }
}

module.exports = {
    getTransaction,
    getAllTransactions,
    getPayablesTransaction
}