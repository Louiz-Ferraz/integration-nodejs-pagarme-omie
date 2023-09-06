-- DROP TABLE accounts_receivable;
-- DROP TABLE service_orders;
-- DROP TABLE departments;

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
(791, 822, 'PM T01 COMP', 178.2, 2961750801),
(792, 803, 'PM T01 COMP', 198, 2961750801);