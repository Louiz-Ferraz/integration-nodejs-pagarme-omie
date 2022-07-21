const axios = require('axios');

const instanciaAxios = axios.create({
    baseURL: 'https://api.pagar.me/1/',
    params: {
        api_key: process.env.PAGARME_API_KEY
    }
});

module.exports = instanciaAxios;