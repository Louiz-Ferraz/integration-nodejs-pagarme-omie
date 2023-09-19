const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getAllAccounts = async (req, res) => {
  try {
    const body = {
      call: 'ListarContasCorrentes',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "registros_por_pagina": 500,
          "apenas_importado_api": "N"
        }
      ]
    }

    const accounts = await instanciaAxiosOmie.post(`geral/contacorrente/`, body);

    for (let item of accounts.data.ListarContasCorrentes) {
      await knex('accounts')
        .insert({
          descricao: item.descricao,
          codigo: item.nCodCC
        });
    }

    return res.status(accounts.status).json(accounts.data);
  } catch (error) {
    const { status, data: { errors } } = error.response;
    return res.status(status).json(
      `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
    );
  }
}

module.exports = {
  getAllAccounts
}