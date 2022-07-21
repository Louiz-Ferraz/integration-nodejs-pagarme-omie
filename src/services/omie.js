const axios = require('axios');

const instanciaAxiosOmie = axios.create({
    baseURL: 'https://app.omie.com.br/api/v1/'
});

module.exports = instanciaAxiosOmie;