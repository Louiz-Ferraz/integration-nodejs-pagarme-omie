const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getAccountsReceivable = async (req, res) => {
  const { id } = req.params;

}

const getAllAccountsReceivable = async (req, res) => {
  const { pagina } = req.body;

  try {
    const body = {
      call: 'ListarContasReceber',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "pagina": pagina,
          "registros_por_pagina": 500,
          "apenas_importado_api": "N"
        }
      ]
    }

    const accountsReceivables = await instanciaAxiosOmie.post(`financas/contareceber/`, body);
    const serviceOrders = await knex('service_orders');
    let arrayNfse = [];
    for (let item of serviceOrders) {
      arrayNfse.push(item.nfse);
    }

    for (let item of accountsReceivables.data.conta_receber_cadastro) {
      if (arrayNfse.includes(Number(item.numero_documento_fiscal))) {
        await knex('accounts_receivable')
          .insert({
            codigo_lancamento_omie: item.codigo_lancamento_omie,
            valor_documento: item.valor_documento,
            numero_documento_fiscal: item.numero_documento_fiscal
          });
      }
    }

    return res.status(accountsReceivables.status).json(accountsReceivables.data);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const addDepartmentToAccountsReceivable = async (req, res) => {
  try {
    let serviceOrders = await knex('service_orders')
      .leftJoin('accounts_receivable', 'service_orders.nfse', 'accounts_receivable.numero_documento_fiscal')
      .returning('*');

    for (let item of serviceOrders) {
      const body = {
        call: 'AlterarContaReceber',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_lancamento_omie": item.codigo_lancamento_omie,
            "valor_documento": item.valor_documento,
            "distribuicao": [
              {
                "cCodDep": item.cod_dep,
                "nPerDep": 100
              }
            ]
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contareceber/`, body);
    }

    return res.status(201).json(serviceOrders);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getAccountsReceivable,
  getAllAccountsReceivable,
  addDepartmentToAccountsReceivable
}