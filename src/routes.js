const express = require('express');

const routes = express();

routes.get('/transactions', async (req, res) => {
    return res.json({message: 'test'});
});

module.exports = routes;