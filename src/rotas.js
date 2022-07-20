const express = require('express');
const autenticacaoControlador = require('./controladores/autenticacao');
const usuariosControlador = require('./controladores/usuarios');
const filtroLogin = require('./filtros/filtroLogin');

const rotas = express();

rotas.post('/usuarios', usuariosControlador.cadastrarUsuario);
rotas.post('/login', autenticacaoControlador.login);

rotas.use(filtroLogin);

rotas.get('/perfil', usuariosControlador.obterPerfilUsuario);
rotas.put('/perfil', usuariosControlador.atualizarPerfilUsuario);

module.exports = rotas;