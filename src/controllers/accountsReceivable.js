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
          "registros_por_pagina": 1000,
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

const deleteBaixa = async (req, res) => {
  try {
    const codesBaixa = await knex('baixas_codes');
    let arrayCodesBaixa = [];
    for (let item of codesBaixa) {
      arrayCodesBaixa.push(item.codigo_baixa);

      const body = {
        call: 'CancelarRecebimento',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_baixa": item.codigo_baixa
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contareceber/`, body);
    }

    return res.status(200).json(arrayCodesBaixa);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const getAllAccountsReceivableTwo = async (req, res) => {
  const { pagina, filtrar_conta_corrente } = req.body;

  try {
    const body = {
      call: 'ListarContasReceber',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "pagina": pagina,
          "registros_por_pagina": 1000,
          "apenas_importado_api": "N",
          "filtrar_conta_corrente": filtrar_conta_corrente
        }
      ]
    }

    const accountsReceivables = await instanciaAxiosOmie.post(`financas/contareceber/`, body);

    for (let item of accountsReceivables.data.conta_receber_cadastro) {
      await knex('accounts_receivable')
        .insert({
          codigo_lancamento_omie: item.codigo_lancamento_omie,
          valor_documento: item.valor_documento,
          numero_documento_fiscal: item.numero_documento_fiscal,
          id_conta_corrente: item.id_conta_corrente
        });
    }

    return res.status(accountsReceivables.status).json(accountsReceivables.data);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const patchAccountsReceivable = async (req, res) => {
  try {
    let accountsReceivable = await knex('accounts_receivable_two');

    for (let item of accountsReceivable) {
      const body = {
        call: 'AlterarContaReceber',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_lancamento_omie": item.codigo_lancamento_omie,
            "valor_documento": item.valor_documento,
            "cNumeroContrato": item.numero_contrato,
            "id_conta_corrente": item.id_conta_corrente,
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

    return res.status(201).json(accountsReceivable);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const addBaixaAccountsReceivable = async (req, res) => {
  try {
    let baixaAccountsReceivable = await knex('baixas_accounts_receivable');

    for (let item of baixaAccountsReceivable) {
      const body = {
        call: 'LancarRecebimento',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_lancamento": item.codigo_lancamento_omie,
            "codigo_conta_corrente": item.codigo_conta_corrente,
            "valor": item.valor,
            "data": item.datab,
            "observacao": item.observacao
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contareceber/`, body);
    }

    return res.status(201).json(baixaAccountsReceivable);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getAccountsReceivable,
  getAllAccountsReceivable,
  addDepartmentToAccountsReceivable,
  deleteBaixa,
  getAllAccountsReceivableTwo,
  patchAccountsReceivable,
  addBaixaAccountsReceivable
}