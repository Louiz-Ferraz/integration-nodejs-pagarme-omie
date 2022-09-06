const instanciaAxiosPagarme = require('../pagarme');

const getTransactionById = async (id) => {
  try {
      const transaction = await instanciaAxiosPagarme.get(`transactions/${id}`);
      return transaction.data;
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getTransactionById
}