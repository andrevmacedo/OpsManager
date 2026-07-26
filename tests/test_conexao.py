import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.conexao import testar_conexao


def testconexao():
    caminho_temp = "database/banco.db"
    if not os.path.exists(caminho_temp):
        print(f"Inválida → Banco não encontrado: {caminho_temp}")
        return
    resultado, mensagem = testar_conexao(caminho_temp)
    if not resultado:
        print(f"Inválida → {mensagem}")
        return
    print(f"Válida → {mensagem}")

testconexao()