-- categorias
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Relatório', '#58A6FF');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Limpeza', '#FF7B72');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Métricas', '#3FB950');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Verificação', '#E3B341');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Backup', '#BC8CFF');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('ETL', '#39D3BB');

-- operacoes
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Gerar Relatório Diário', 'Exporta execuções do dia para CSV', 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Limpar Logs Antigos', 'Deleta execuções com mais de 30 dias', 2, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Calcular Métricas Diárias', 'Calcula e persiste taxa de sucesso por operação', 3, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Verificar Falhas Consecutivas', 'Detecta operações que falharam 3x seguidas', 4, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Backup do Banco', 'Copia o banco de dados para pasta de backup', 5, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, status) VALUES
    ('Importar CSV', 'Lê um arquivo CSV e insere os dados no banco', 6, 'ativa');