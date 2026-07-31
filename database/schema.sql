CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    cor TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    perfil TEXT NOT NULL CHECK(perfil IN('admin','operador'))
);
CREATE TABLE IF NOT EXISTS operacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    id_categoria INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ativa','inativa')),
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),    
    FOREIGN KEY (id_categoria) REFERENCES categorias(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS execucoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_operacao INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    inicio TEXT,
    fim TEXT,
    duracao INTEGER,
    status TEXT NOT NULL CHECK(status IN ('pendente', 'executando', 'concluida', 'falhou')),
    log TEXT,
    FOREIGN KEY (id_operacao) REFERENCES operacoes(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_operacao INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    frequencia TEXT NOT NULL CHECK(frequencia IN ('hora', 'diario', 'semanal', 'mensal')),
    proxima_execucao TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_operacao) REFERENCES operacoes(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
