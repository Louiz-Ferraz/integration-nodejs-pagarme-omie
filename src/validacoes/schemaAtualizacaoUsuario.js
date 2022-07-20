const yup = require('./yup');

const schemaAtualizacaoUsuario = yup.object().shape({
    nome: yup
        .string(),
    email: yup
        .string()
        .email(),
    senha: yup
        .string(),
    nome_loja: yup
        .string()
});

module.exports = schemaAtualizacaoUsuario;