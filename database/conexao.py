# database/conexao.py
import os
import sqlite3

from dotenv import load_dotenv, set_key
from flask import g  # g é um objeto do Flask que dura apenas uma requisição

load_dotenv()  # carrega as variáveis do .env
print(f"DB_PATH no load: {os.getenv('DB_PATH')}")  # ← adiciona aqui

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # caminho absoluto da pasta database/

def get_connection():
    load_dotenv(override=True)
    # busca o caminho do banco no .env
    db_path = os.getenv("DB_PATH")
    print(f"DB_PATH: {db_path}")
    # se o banco não foi configurado ainda, retorna None
    if not db_path:
        return None
    # se o caminho for relativo (ex: "database/opsmanager.db")
    # resolve a partir da raiz do projeto em vez do diretório atual
    if not os.path.isabs(db_path):
        ROOT_DIR = os.path.dirname(BASE_DIR)  # sobe uma pasta acima de database/
        db_path = os.path.join(ROOT_DIR, db_path)
        print(f"Caminho resolvido: {db_path}")
    # se já existe uma conexão aberta nessa requisição, reutiliza
    # evita abrir múltiplas conexões para a mesma requisição
    if "db" not in g:
        g.db = sqlite3.connect(db_path)
        # row_factory faz o banco retornar dicionários em vez de tuplas
        # permite acessar colunas pelo nome: row["nome"] em vez de row[0]
        g.db.row_factory = sqlite3.Row
    return g.db

def close_connection(error=None):
    # remove a conexão do g e fecha ao fim da requisição
    # chamado automaticamente pelo teardown_appcontext
    db = g.pop("db", None)
    if db is not None:
        db.close()

def salvar_configuracao(db_path):
    # monta o caminho do .env — está uma pasta acima de database/
    env_path = os.path.join(os.path.dirname(BASE_DIR), ".env")
    # escreve DB_PATH=caminho_do_banco no arquivo .env
    set_key(env_path, "DB_PATH", db_path)
    # recarrega o .env para que os.getenv já reflita o novo valor
    load_dotenv(override=True)

def testar_conexao(db_path):
    # verifica se o arquivo existe antes de tentar abrir
    if not os.path.exists(db_path):
        return False, "Banco de dados não encontrado!"
    try:
        conn = sqlite3.connect(db_path)
        conn.execute("SELECT 1")  
        conn.close()
        return True, "Conexão realizada com sucesso!"
    except Exception as e:  # noqa: BLE001
        return False, f"Erro: {e}"