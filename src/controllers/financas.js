const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getBaixas = async (req, res) => {
  const { pagina, contaCorrente, cTpLancamento } = req.body;

  try {
    const body = {
      call: 'ListarMovimentos',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "nPagina": pagina,
          "nRegPorPagina": 1000,
          "cTpLancamento": cTpLancamento,
          "nCodCC": contaCorrente
        }
      ]
    }

    const baixas = await instanciaAxiosOmie.post(`financas/mf/`, body);

    let codigosBaixa = [];
    for (let item of baixas.data.movimentos) {
      codigosBaixa.push(item.detalhes.nCodBaixa);
    }

    for (let item of codigosBaixa) {
      await knex('baixas_codes')
        .insert({
          codigo_baixa: item
        });
    }

    return res.status(baixas.status).json(codigosBaixa);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const getBaixasComplete = async (req, res) => {
  const { pagina, contaCorrente, cTpLancamento } = req.body;

  try {
    const body = {
      call: 'ListarMovimentos',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "nPagina": pagina,
          "nRegPorPagina": 1000,
          "cTpLancamento": cTpLancamento,
          "nCodCC": contaCorrente
        }
      ]
    }

    const baixas = await instanciaAxiosOmie.post(`financas/mf/`, body);

    for (let item of baixas.data.movimentos) {
      await knex('baixas_complete')
        .insert({
          ncodbaixa: item.detalhes.nCodBaixa,
          ccodcateg: item.detalhes.cCodCateg,
          cstatus: item.detalhes.cStatus,
          ddtcredito: item.detalhes.dDtCredito,
          ncodcc: item.detalhes.nCodCC,
          ncodcliente: item.detalhes.nCodCliente,
          nvalormovcc: item.detalhes.nValorMovCC
        });
    }

    return res.status(baixas.status).json(baixas.data);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getBaixas,
  getBaixasComplete
}