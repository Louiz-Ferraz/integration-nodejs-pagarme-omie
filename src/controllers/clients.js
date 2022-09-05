const {getClientCodeByCpf} = require('../services/utils/clients');

const getClient = async (req, res) => {
    const { cpf } = req.params;
    try {
      clientCode = await getClientCodeByCpf(cpf);
      return res.status(200).json(clientCode);
    } catch (error) {
      return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
  getClient
}