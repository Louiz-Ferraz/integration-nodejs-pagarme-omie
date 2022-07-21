const instanciaAxios = require('../services/pagarme');

const getTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await instanciaAxios.get(`transactions/${id}`);
        return res.status(transaction.status).json(transaction.data);
    } catch (error) {
        const { status, data: { errors } } = error.response;
        return res.status(status).json(
            `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
        );
    }
}

const getAllTransactions = async (req, res) => {
    const { status } = req.query;
    instanciaAxios.defaults.params.status = status;

    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 90));
    instanciaAxios.defaults.params.date_updated = `>=${+priorDate}`;

    instanciaAxios.defaults.params.count = 1000;
    instanciaAxios.defaults.params.page = 1;

    try {
        let transactions = await instanciaAxios.get(`transactions`);
        let arrayTransactions = transactions.data;

        if(arrayTransactions.length >= 1000) { 
            while (transactions.data.length >= 1000) {
                instanciaAxios.defaults.params.page++;
                transactions = await instanciaAxios.get(`transactions`);
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
        const transactions = await instanciaAxios.get(`transactions/${id}/payables`);

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