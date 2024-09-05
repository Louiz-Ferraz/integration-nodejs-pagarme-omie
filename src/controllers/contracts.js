const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getContractsFromList = async (req, res) => {
  try {
    let contracts = await knex('contracts_to_get');

    for (let item of contracts) {
      const body = {
        call: 'ConsultarContrato',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "contratoChave": {
              "nCodCtr": item.n_cod_ctr
            }
          }
        ]
      }

      let contractsToPatch = await instanciaAxiosOmie.post(`servicos/contrato/`, body);
      let itemToPatch = contractsToPatch.data.contratoCadastro;

      await knex('contracts_to_patch_with_nat_op')
        .insert({
          n_cod_ctr: itemToPatch.cabecalho.nCodCtr,
          n_cod_cli: itemToPatch.cabecalho.nCodCli,
          c_num_ctr: itemToPatch.cabecalho.cNumCtr,
          n_cod_cc: itemToPatch.infAdic.nCodCC,
          d_vig_inicial: itemToPatch.cabecalho.dVigInicial,
          d_vig_final: itemToPatch.cabecalho.dVigFinal,
          cod_item: itemToPatch.itensContrato[0].itemCabecalho.codItem
        });
    }

    return res.status(201).json("Item IDs registered");
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const getAllContracts = async (req, res) => {
  const { pagina } = req.body;

  try {
    const body = {
      call: 'ListarContratos',
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

    const contracts = await instanciaAxiosOmie.post(`servicos/contrato/`, body);

    for (let item of contracts.data.contratoCadastro) {
      if (item.cabecalho.cCodSit == 10) { // 10 equivale aos contratos ativos 
        if (typeof item.departamentos[0] === "undefined") {
          await knex('contracts')
            .insert({
              n_cod_ctr: item.cabecalho.nCodCtr,
              c_num_ctr: item.cabecalho.cNumCtr,
              d_vig_inicial: item.cabecalho.dVigInicial,
              d_vig_final: item.cabecalho.dVigFinal,
              n_cod_cli: item.cabecalho.nCodCli,
              n_cod_cc: item.infAdic.nCodCC,
              n_val_tot_mes: item.cabecalho.nValTotMes,
              c_cod_dep: 'N/D'
            });
        } else {
          await knex('contracts')
            .insert({
              n_cod_ctr: item.cabecalho.nCodCtr,
              c_num_ctr: item.cabecalho.cNumCtr,
              d_vig_inicial: item.cabecalho.dVigInicial,
              d_vig_final: item.cabecalho.dVigFinal,
              n_cod_cli: item.cabecalho.nCodCli,
              n_cod_cc: item.infAdic.nCodCC,
              n_val_tot_mes: item.cabecalho.nValTotMes,
              c_cod_dep: item.departamentos[0].cCodDep
            });
        }
      }
    }


    return res.status(contracts.status).json(contracts.data);
  } catch (error) {
    const { status, data: { errors } } = error.response;
    return res.status(status).json(
      `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
    );
  }
}

const patchContracts = async (req, res) => {
  try {
    let contracts = await knex('contracts_to_patch');

    for (let item of contracts) {
      const body = {
        call: 'AlterarContrato',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "cabecalho": {
              "nCodCtr": item.n_cod_ctr,
              "nCodCli": item.n_cod_cli,
              "cNumCtr": item.c_num_ctr,
              "dVigInicial": item.d_vig_inicial,
              "dVigFinal": item.d_vig_final
            },
            "departamentos": [
              {
                "cCodDep": item.cod_dep,
                "nValDep": item.n_val_tot_mes,
                "nPerDep": 100
              }
            ],
            "infAdic": {
              "nCodCC": item.n_cod_cc
            }
          }
        ]
      }

      await instanciaAxiosOmie.post(`servicos/contrato/`, body);
    }

    return res.status(201).json(contracts);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const patchContractsWithNaturezaOperacao = async (req, res) => {
  try {
    let contracts = await knex('contracts_to_patch_with_nat_op');

    for (let item of contracts) {
      const body = {
        call: 'AlterarContrato',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            "cabecalho": {
              "nCodCtr": item.n_cod_ctr,
              "nCodCli": item.n_cod_cli,
              "cNumCtr": item.c_num_ctr,
              "dVigInicial": item.d_vig_inicial,
              "dVigFinal": item.d_vig_final
            },
            "infAdic": {
              "nCodCC": item.n_cod_cc
            },
            "itensContrato": [
              {
                "itemCabecalho": {
                  "codItem": item.cod_item,
                  "seq": 1,
                  "natOperacao": "03"
                }
              }
            ]
          }
        ]
      }

      await instanciaAxiosOmie.post(`servicos/contrato/`, body);
    }

    return res.status(201).json(contracts);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  getContractsFromList,
  getAllContracts,
  patchContracts,
  patchContractsWithNaturezaOperacao,
}