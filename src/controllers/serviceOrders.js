const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');
const { getClientCodeByCpf } = require('../services/utils/clients');
const { v4: uuidv4 } = require('uuid');

const getServiceOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const body = {
      call: 'ConsultarOS',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          cNumOS: id
        }
      ]
    }

    const serviceOrder = await instanciaAxiosOmie.post(`servicos/os/`, body);
    return res.status(serviceOrder.status).json(serviceOrder.data);
  } catch (error) {
    const { status, data: { errors } } = error.response;
    return res.status(status).json(
      `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
    );
  }
}

const resendServiceOrder = async (req, res) => {
  let serviceOrdersNCodOsArray = [];
  try {
    let body = {};
    let serviceOrder = {};
    let resendServiceOrder = {};
    let serviceOrders = await knex('service_orders_to_resend');

    for (let item of serviceOrders) {
      body = {
        call: 'ConsultarOS',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            cNumOS: item.c_num_os
          }
        ]
      }

      serviceOrder = await instanciaAxiosOmie.post(`servicos/os/`, body);
      serviceOrdersNCodOsArray.push(serviceOrder.data.Cabecalho.nCodOS);
    }

    for (let item of serviceOrdersNCodOsArray) {
      body = {
        call: 'ReenviarOS',
        app_key: process.env.OMIE_APP_KEY,
        app_secret: process.env.OMIE_APP_SECRET,
        param: [
          {
            nCodOS: item
          }
        ]
      }

      resendServiceOrder = await instanciaAxiosOmie.post(`servicos/osp/`, body);
    }

    return res.status(resendServiceOrder.status).json(`nCodOS: ${resendServiceOrder.data.nCodOS}, cDescStatus: ${resendServiceOrder.data.cDescStatus}`);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const postServiceOrder = async (req, res) => {
  try {
    const body = {
      call: 'IncluirOS',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "Cabecalho": {
            "cCodIntOS": uuidv4(),
            "nCodCli": await getClientCodeByCpf('432.119.748-14'),
            "dDtPrevisao": "31/08/2022",
            "cEtapa": "20",
            "cCodParc": "000",
            "nQtdeParc": 1
          },
          "InformacoesAdicionais": {
            "cCodCateg": "1.01.02",
            "nCodCC": "3055866389",
            "cCidPrestServ": "Salvador (BA)"
          },
          "Email": {
            "cEnvRecibo": "N",
            "cEnvLink": "S",
            "cEnvBoleto": "N",
            "cEnviarPara": "financeiro@cubos.academy"
          },
          "Departamentos": [
            {
              "cCodDepto": "3197779426",
              "nPerc": 100,
              "nValor": 1,
              "nValorFixo": "S"
            }
          ],
          "ServicosPrestados": [
            {
              "nCodServico": 3108685084,
              "nQtde": 1,
              "nValUnit": 1,
              "cNaoGerarFinanceiro": "N"
            }
          ],
          "Parcelas": {},
          "Observacoes": {
            "cObsOS": "OS criada via API em testes"
          }
        }
      ]
    }

    const serviceOrder = await instanciaAxiosOmie.post(`servicos/os/`, body);
    return res.status(serviceOrder.status).json(serviceOrder.data);
  } catch (error) {
    const { status, data: { errors } } = error.response;
    return res.status(status).json(
      `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
    );
  }
}

module.exports = {
  getServiceOrder,
  postServiceOrder,
  resendServiceOrder
}