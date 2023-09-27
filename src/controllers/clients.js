const { getClientCodeByCpf } = require('../services/utils/clients');
const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getClient = async (req, res) => {
  const { cpf } = req.params;
  try {
    const clientCode = await getClientCodeByCpf(cpf);
    return res.status(200).json(clientCode);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const getAllClients = async (req, res) => {
  const { pagina } = req.body;

  try {
    const body = {
      call: 'ListarClientes',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "pagina": pagina,
          "registros_por_pagina": 1000,
          "apenas_importado_api": "N"
        }
      ]
    }

    const clients = await instanciaAxiosOmie.post(`geral/clientes/`, body);

    for (let item of clients.data.clientes_cadastro) {
      await knex('clients')
        .insert({
          codigo_cliente_omie: item.codigo_cliente_omie,
          cnpj_cpf: item.cnpj_cpf,
          nome_fantasia: item.nome_fantasia
        });
    }

    return res.status(clients.status).json(clients.data);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getClient,
  getAllClients
}