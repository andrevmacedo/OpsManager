import os
import sqlite3

# inicializa o banco de dados na máquina do usuário, com todas as tabelas e inserts 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "opsmanager.db")

conn = sqlite3.connect(DB_PATH)
with open(os.path.join(BASE_DIR, "schema.sql"), "r", encoding="utf-8") as f:
    conn.executescript(f.read())

with open(os.path.join(BASE_DIR, "seeds.sql"), "r", encoding="utf-8") as f:
    conn.executescript(f.read())
conn.close()
print(f"Banco iniciado em: {DB_PATH}")