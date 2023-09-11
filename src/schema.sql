-- DROP TABLE accounts_receivable;
-- DROP TABLE accounts_receivable_two;
-- DROP TABLE service_orders;
-- DROP TABLE departments;
-- DROP TABLE baixas_codes;

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

CREATE TABLE IF NOT EXISTS accounts_receivable (
  codigo_lancamento_omie TEXT NOT NULL,
  valor_documento DECIMAL NOT NULL,
  numero_documento_fiscal INT REFERENCES service_orders(nfse)
);

CREATE TABLE IF NOT EXISTS baixas_codes (
  codigo_baixa TEXT NOT NULL
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
(7534495773, 4391, 4557, 'DBE-DIR-DBE T02', 2111.11, 7562490682, '11079736948DB0291', 7566731700),
(7534495778, 4328, 4504, 'UXUI-DIR-UXUI T11', 439.83, 7562491985, '08748372510UX1131', 3032861215);