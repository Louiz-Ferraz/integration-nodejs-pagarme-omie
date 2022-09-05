const instanciaAxiosOmie = require('../omie');

const getClientCodeByCpf = async (cpf) => {
    let allClients = [];

    try {
      const body = {
          call: 'ListarClientesResumido',
          app_key: process.env.OMIE_APP_KEY,
          app_secret: process.env.OMIE_APP_SECRET,
          param: [
            {
              "pagina": 1,
              "registros_por_pagina": 500,
              "apenas_importado_api": "N"
            }
          ]
      }

        let clients = await instanciaAxiosOmie.post(`geral/clientes/`, body);
        allClients = clients.data.clientes_cadastro_resumido;
        if(allClients.length >= 500) {
          while(clients.data.clientes_cadastro_resumido.length >= 500) {
            body.param[0].pagina++;
            clients = await instanciaAxiosOmie.post(`geral/clientes/`, body);
            for (let item of clients.data.clientes_cadastro_resumido) {
              allClients.push(item);
            }
          }
        }

        let wantedClient = allClients.find(client => client.cnpj_cpf === cpf);
        return wantedClient.codigo_cliente;
      } catch (error) {
        return res.status(400).json({ mensagem: error.message });
      }
}

module.exports = {
  getClientCodeByCpf
}