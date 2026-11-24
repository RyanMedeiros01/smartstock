-- =====================================================
-- SmartStock - Modelo inicial do Banco de Dados (MySQL 8)
-- Atividade 6 - Programa de Estágio de Férias (DEV)
-- =====================================================

CREATE DATABASE IF NOT EXISTS smartstock
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE smartstock;

-- -----------------------------------------------------
-- Tabela: produtos
-- -----------------------------------------------------
CREATE TABLE produtos (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nome            VARCHAR(120)  NOT NULL,
  categoria       VARCHAR(60)   NOT NULL,
  quantidade      INT UNSIGNED  NOT NULL DEFAULT 0,
  estoque_minimo  INT UNSIGNED  NOT NULL DEFAULT 0,
  preco           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  data_cadastro   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_produtos PRIMARY KEY (id),
  CONSTRAINT ck_produtos_preco CHECK (preco >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_produtos_nome      ON produtos (nome);
CREATE INDEX idx_produtos_categoria ON produtos (categoria);

-- -----------------------------------------------------
-- Tabela: movimentacoes
-- -----------------------------------------------------
CREATE TABLE movimentacoes (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  produto_id  INT UNSIGNED NOT NULL,
  tipo        ENUM('ENTRADA','SAIDA') NOT NULL,
  quantidade  INT UNSIGNED NOT NULL,
  data        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_movimentacoes PRIMARY KEY (id),
  CONSTRAINT fk_mov_produto FOREIGN KEY (produto_id)
    REFERENCES produtos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,          -- RN04: não apaga produto com histórico
  CONSTRAINT ck_mov_qtd CHECK (quantidade > 0)   -- RN05
) ENGINE=InnoDB;

CREATE INDEX idx_mov_produto_data ON movimentacoes (produto_id, data);

-- -----------------------------------------------------
-- View de apoio: produtos abaixo do estoque mínimo (RN03)
-- Usada pelo dashboard, relatórios e alertas (N8N)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW vw_produtos_criticos AS
SELECT id, nome, categoria, quantidade, estoque_minimo,
       (estoque_minimo - quantidade) AS faltam
FROM produtos
WHERE quantidade <= estoque_minimo;

-- -----------------------------------------------------
-- Dados de exemplo
-- -----------------------------------------------------
INSERT INTO produtos (nome, categoria, quantidade, estoque_minimo, preco) VALUES
('Notebook Dell Inspiron 15', 'Eletrônicos', 18, 5,  3899.90),
('Mouse sem fio Logitech M170','Periféricos', 4, 10,   79.90),
('Teclado mecânico Redragon', 'Periféricos', 22, 8,  249.90),
('Monitor LG 24" Full HD',    'Eletrônicos', 3,  4,  899.00),
('Cabo HDMI 2m',              'Acessórios', 120, 30,  24.90),
('Papel A4 Chamex (resma)',   'Escritório',  12, 15,  32.50);

INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES
(1, 'ENTRADA', 20), (1, 'SAIDA', 2),
(2, 'ENTRADA', 10), (2, 'SAIDA', 6),
(5, 'ENTRADA', 150),(5, 'SAIDA', 30);
