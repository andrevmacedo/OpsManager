-- categorias
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Relatório', '#58A6FF');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Limpeza', '#FF7B72');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Métricas', '#3FB950');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Verificação', '#E3B341');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('Backup', '#BC8CFF');
INSERT OR IGNORE INTO categorias (nome, cor) VALUES ('ETL', '#39D3BB');
-- usuarios
INSERT OR IGNORE INTO usuarios (nome, email, senha, perfil) VALUES
('João Silva', 'joao.silva@opsmanager.com', '123456', 'admin');
INSERT OR IGNORE INTO usuarios (nome, email, senha, perfil) VALUES
('Maria Oliveira', 'maria.oliveira@opsmanager.com', '123456', 'operador');
-- operacoes
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Gerar Relatório Diário', 'Exporta execuções do dia para CSV', 1, 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Limpar Logs Antigos', 'Deleta execuções com mais de 30 dias', 2, 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Calcular Métricas Diárias', 'Calcula e persiste taxa de sucesso por operação', 3, 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Verificar Falhas Consecutivas', 'Detecta operações que falharam 3x seguidas', 4, 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Backup do Banco', 'Copia o banco de dados para pasta de backup', 5, 1, 'ativa');
INSERT OR IGNORE INTO operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES
('Importar CSV', 'Lê um arquivo CSV e insere os dados no banco', 6, 1, 'ativa');