const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getAllAccountsPayable = async (req, res) => {
  const { pagina, filtrar_conta_corrente } = req.body;

  try {
    const body = {
      call: 'ListarContasPagar',
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

    const accountsPayables = await instanciaAxiosOmie.post(`financas/contapagar/`, body);

    for (let item of accountsPayables.data.conta_pagar_cadastro) {
      await knex('accounts_payable')
        .insert({
          codigo_lancamento_omie: item.codigo_lancamento_omie,
          numero_documento_fiscal: item.numero_documento_fiscal,
          turma: item.distribuicao[0].cDesDep,
          valor_documento: item.valor_documento,
          cod_dep: item.distribuicao[0].cCodDep,
          id_conta_corrente: item.id_conta_corrente,
          codigo_cliente_fornecedor: item.codigo_cliente_fornecedor,
          data_vencimento: item.data_vencimento
        });
    }

    return res.status(accountsPayables.status).json(accountsPayables.data);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const deleteBaixaAccountsPayable = async (req, res) => {
  try {
    const codesBaixa = await knex('baixas_codes');
    let arrayCodesBaixa = [];
    for (let item of codesBaixa) {
      arrayCodesBaixa.push(item.codigo_baixa);

      const body = {
        call: 'CancelarPagamento',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_baixa": item.codigo_baixa
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contapagar/`, body);
    }

    return res.status(200).json(arrayCodesBaixa);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const patchAccountsPayable = async (req, res) => {
  try {
    let accountsPayable = await knex('accounts_payable_two');

    for (let item of accountsPayable) {
      const body = {
        call: 'AlterarContaPagar',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_lancamento_omie": item.codigo_lancamento_omie,
            "valor_documento": item.valor_documento,
            "id_conta_corrente": item.id_conta_corrente,
            "numero_documento": item.numero_documento
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contapagar/`, body);
    }

    return res.status(201).json(accountsPayable);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const addBaixaAccountsPayable = async (req, res) => {
  try {
    let baixaAccountsPayable = await knex('baixas_accounts_payable');

    for (let item of baixaAccountsPayable) {
      const body = {
        call: 'LancarPagamento',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "codigo_lancamento": item.codigo_lancamento,
            "codigo_conta_corrente": item.codigo_conta_corrente,
            "valor": item.valor,
            "data": item.datab,
            "observacao": item.observacao
          }
        ]
      }

      await instanciaAxiosOmie.post(`financas/contapagar/`, body);
    }

    return res.status(201).json(baixaAccountsPayable);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getAllAccountsPayable,
  deleteBaixaAccountsPayable,
  patchAccountsPayable,
  addBaixaAccountsPayable
}