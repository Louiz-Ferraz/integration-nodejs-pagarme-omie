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

const createTransaction = async (req, res) => {
    const body = req.body;

    try {
        const transaction = await instanciaAxios.post('transactions', body);
        return res.status(201).json(transaction.data);
    } catch (error) {
        const { status, data: { errors } } = error.response;
        return res.status(status).json(
            `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
        );
    }
}

module.exports = {
    getTransaction,
    createTransaction,
}