const instanciaAxiosOmie = require('../services/omie');

const getServiceOrder = async (req, res) => {
    const { id } = req.params;

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

    try {
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
    getServiceOrder
}