const instanciaAxiosOmie = require('../services/omie');
const knex = require('../conexao');

const getAllDepartments = async (req, res) => {
  try {
    const body = {
      call: 'ListarDepartamentos',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [
        {
          "registros_por_pagina": 500
        }
      ]
    }

    const departments = await instanciaAxiosOmie.post(`geral/departamentos/`, body);

    for (let item of departments.data.departamentos) {
      await knex('departments')
        .insert({
          descricao: item.descricao,
          codigo: item.codigo
        });
    }

    return res.status(departments.status).json(departments.data);
  } catch (error) {
    const { status, data: { errors } } = error.response;
    return res.status(status).json(
      `${errors[0].type}: ${errors[0].parameter_name} - ${errors[0].message}`
    );
  }
}

module.exports = {
  getAllDepartments
}