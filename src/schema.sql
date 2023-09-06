-- DROP TABLE accounts_receivable;
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

INSERT INTO service_orders
(nfse, os, turma, valor_liquido, cod_dep)
VALUES
(3831, 3907, 'DBE T02', 855, 7462909974),
(4087, 4122, 'PDZ T02 INT', 1000, 2961750797);