import os
import sqlite3

from dotenv import (  # load_dotenv carrega o .env, set_key salva uma variável no .env
    load_dotenv,
    set_key,
)

load_dotenv()  # carrega as variáveis do .env para o os.getenv funcionar

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # caminho absoluto da pasta database/

def get_connection():
    # busca o caminho do banco salvo no .env
    db_path = os.getenv("DB_PATH")
    # se o usuário ainda não configurou o banco, retorna None
    if not db_path:
        return None
    # abre e retorna a conexão com o banco
    return sqlite3.connect(db_path)
def salvar_configuracao(db_path):
    # monta o caminho do .env — está uma pasta acima de database/
    env_path = os.path.join(os.path.dirname(BASE_DIR), ".env")
    # escreve DB_PATH=caminho_do_banco no arquivo .env
    set_key(env_path, "DB_PATH", db_path)
    # recarrega o .env para que os.getenv já reflita o novo valor
    # override=True sobrescreve variáveis já carregadas na memória
    load_dotenv(override=True)

def testar_conexao(db_path):
    try:
        # tenta abrir a conexão com o caminho informado
        conn = sqlite3.connect(db_path)
        conn.execute("SELECT 1")
        conn.close()
        return True, "Conexão realizada com sucesso!"
    except Exception as e:  # noqa: BLE001
        # se qualquer erro acontecer, retorna False com a mensagem do erro
        return False, f"Erro: {e}" 
