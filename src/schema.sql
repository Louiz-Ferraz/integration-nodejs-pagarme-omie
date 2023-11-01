-- DROP TABLE accounts_receivable;
-- DROP TABLE accounts_receivable_two;
-- DROP TABLE service_orders;
-- DROP TABLE departments;
-- DROP TABLE accounts;
-- DROP TABLE clients;
-- DROP TABLE baixas_codes;
-- DROP TABLE baixas_complete;
-- DROP TABLE baixas_accounts_receivable;
-- DROP TABLE accounts_payable;
-- DROP TABLE accounts_payable_two;
-- DROP TABLE baixas_accounts_payable;
-- DROP TABLE contracts;
-- DROP TABLE contracts_to_patch;
-- DROP TABLE accounts_payable_delete;

CREATE TABLE IF NOT EXISTS service_orders (
  nfse INT NOT NULL PRIMARY KEY,
  os INT NOT NULL,
  turma TEXT NOT NULL,
  valor_liquido DECIMAL NOT NULL,
  cod_dep TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  descricao TEXT NOT NULL,
  codigo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  descricao TEXT NOT NULL,
  codigo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts_receivable (
  codigo_lancamento_omie TEXT NOT NULL,
  valor_documento DECIMAL NOT NULL,
  numero_documento_fiscal TEXT,
  id_conta_corrente TEXT NOT NULL,
  data_registro DATE NOT NULL,
  c_numero_contrato TEXT,
  c_cod_dep TEXT,
  c_des_dep TEXT,
  n_per_dep DECIMAL
);

CREATE TABLE IF NOT EXISTS baixas_codes (
  codigo_baixa TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS baixas_complete (
  nCodBaixa TEXT NOT NULL,
  cCodCateg TEXT NOT NULL,
  cStatus TEXT NOT NULL,
  dDtCredito DATE NOT NULL,
  nCodCC TEXT NOT NULL,
  nCodCliente TEXT NOT NULL,
  nValorMovCC TEXT
);

CREATE TABLE IF NOT EXISTS accounts_receivable_two (
  codigo_lancamento_omie TEXT NOT NULL,
  numero_documento_fiscal INT NOT NULL,
  numero_os INT NOT NULL,
  turma TEXT NOT NULL,
  valor_documento DECIMAL NOT NULL,
  cod_dep TEXT NOT NULL,
  numero_contrato TEXT NOT NULL,
  id_conta_corrente TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS baixas_accounts_receivable (
  codigo_lancamento_omie TEXT NOT NULL,
  codigo_conta_corrente TEXT NOT NULL,
  valor DECIMAL NOT NULL,
  datab TEXT NOT NULL,
  observacao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts_payable (
  codigo_lancamento_omie TEXT NOT NULL,
  numero_documento_fiscal TEXT,
  turma TEXT,
  valor_documento DECIMAL NOT NULL,
  cod_dep TEXT,
  id_conta_corrente TEXT NOT NULL,
  codigo_cliente_fornecedor TEXT NOT NULL,
  data_vencimento TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS accounts_payable_two (
  codigo_lancamento_omie TEXT NOT NULL,
  valor_documento DECIMAL NOT NULL,
  id_conta_corrente TEXT NOT NULL,
  numero_documento TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  codigo_cliente_omie TEXT NOT NULL,
  cnpj_cpf TEXT,
  nome_fantasia TEXT
);

CREATE TABLE IF NOT EXISTS baixas_accounts_payable (
  codigo_lancamento TEXT NOT NULL,
  codigo_conta_corrente TEXT NOT NULL,
  valor DECIMAL NOT NULL,
  datab TEXT NOT NULL,
  observacao TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  n_cod_ctr TEXT NOT NULL,
  c_num_ctr TEXT NOT NULL,
  d_vig_inicial DATE NOT NULL,
  d_vig_final DATE NOT NULL,
  n_cod_cli TEXT NOT NULL,
  n_cod_cc TEXT NOT NULL,
  n_val_tot_mes DECIMAL NOT NULL,
  c_cod_dep TEXT
);

CREATE TABLE IF NOT EXISTS contracts_to_patch (
  n_cod_ctr TEXT NOT NULL,
  n_cod_cli TEXT NOT NULL,
  c_num_ctr TEXT NOT NULL,
  cod_dep TEXT NOT NULL,
  n_val_tot_mes DECIMAL NOT NULL,
  n_cod_cc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts_payable_delete (
  codigo_lancamento_omie TEXT NOT NULL
);

INSERT INTO service_orders
(nfse, os, turma, valor_liquido, cod_dep)
VALUES
(3831, 3907, 'DBE T02', 855, 7462909974),
(4087, 4122, 'PDZ T02 INT', 1000, 2961750797);

INSERT INTO accounts_receivable_two
(
  codigo_lancamento_omie,
  numero_documento_fiscal,
  numero_os,
  turma,
  valor_documento,
  cod_dep,
  numero_contrato,
  id_conta_corrente
)
VALUES
(7624863549, 9673, 0, 'UXUI-DIR-UXUI T14', 396.5, 7562491991, '13046439725UX1441', 3032861215),
(7624863579, 9674, 0, 'OND-DIR-On Demand', 765, 7561994157, '13869858729Onnd97', 3032861215);

INSERT INTO baixas_accounts_receivable
(
  codigo_lancamento_omie,
  codigo_conta_corrente,
  valor,
  datab,
  observacao
)
VALUES
(7637029643, 7624809405, 13.58, '30/09/2023', 'Baixa de adiantamento via API em 03/10/2023'),
(7637044103, 7624809405, 1396.7, '30/09/2023', 'Baixa de adiantamento via API em 03/10/2023');

INSERT INTO accounts_payable_two
(
  codigo_lancamento_omie,
  valor_documento,
  id_conta_corrente,
  numero_documento
)
VALUES
(7534612798, 374, 3032861215, '38851667802UX1153'),
(7535973256, 0.5, 3032861215, '04182491564UX027');

INSERT INTO baixas_accounts_payable
(
  codigo_lancamento,
  codigo_conta_corrente,
  valor,
  datab,
  observacao
)
VALUES
(7612134055, 7566731700, 1200, ' 31/08/2023', 'Correção histórica - Baixas de devoluções de clientes'),
(7612134057, 7566731700, 1866.67, ' 31/08/2023', 'Correção histórica - Baixas de devoluções de clientes');

INSERT INTO contracts_to_patch
(
  n_cod_ctr,
  n_cod_cli,
  c_num_ctr,
  cod_dep,
  n_val_tot_mes,
  n_cod_cc
)
VALUES
(7622403613, 7614590883, '49891547892UX1434', 7562491991, 337, 3032861215),
(7622403615, 7614590857, '02642979113UX1432', 7562491991, 497.33, 3032861215);

INSERT INTO baixas_codes
(
  codigo_baixa
)
VALUES
('7635905450'),
('7635905462');

INSERT INTO accounts_payable_delete
(
  codigo_lancamento_omie
)
VALUES
('7535973256'),
('7535973258');