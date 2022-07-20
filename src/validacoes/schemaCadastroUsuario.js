const yup = require('./yup');

const schemaCadastroUsuario = yup.object().shape({
    nome: yup
        .string()
        .required(),
    email: yup
        .string()
        .email()
        .required(),
    senha: yup
        .string()
        .required(),
    nome_loja: yup
        .string()
        .required()
});

module.exports = schemaCadastroUsuario;