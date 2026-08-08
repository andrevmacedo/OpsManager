import sqlite3

from app.models.operacao import Operacao
from app.repository import categoria_repository, operacao_repository, usuario_repository


def listar():
    return operacao_repository.listar_todas()
def listar_categorias():
    return categoria_repository.listar_categorias()
def buscar(id):
    return operacao_repository.buscar_porid(id)
def criar(nome, descricao, id_categoria, senha):
    usuario = usuario_repository.verificar_senha(senha)
    # verifica se a senha existe
    if not usuario:
        return {"ok": False, "erro": "Senha incorreta."}
    # verifica se o usuário tem permissão de admin
    if usuario["perfil"] != "admin":
        return {"ok": False, "erro": "Apenas administradores podem criar operações."}
    operacao = Operacao(nome, descricao, id_categoria)
    try:
        operacao_repository.criar_operacao(operacao, usuario["id"])
    except sqlite3.IntegrityError:
        return {"ok": False, "erro": "Já existe uma operação com esse nome."}
    return {"ok": True, "responsavel": usuario["nome"], "cor": None}
def excluir(id):
    try:
        operacao_repository.excluir_operacao(id)
    except sqlite3.IntegrityError:
        return {"ok": False, "erro": "Não foi possível excluir essa operação."}
    return {"ok": True, "mensagem": "Operação excluída com sucesso."}
def editar(id, nome, id_categoria, status, senha):
    usuario = usuario_repository.verificar_senha(senha)
    if not usuario:
        return {"ok": False, "erro": "Senha incorreta."}
    if usuario["perfil"] != "admin":
        return {"ok": False, "erro": "Apenas administradores podem editar operações."}
    try:
        operacao_repository.editar_operacao(id, nome, id_categoria, status)
    except sqlite3.IntegrityError:
        return {"ok": False, "erro": "Já existe uma operação com esse nome."}
    # busca os dados atualizados para retornar ao JS
    operacao = operacao_repository.buscar_porid(id)
    return {"ok": True, "categoria": operacao["categoria"], "cor": operacao["cor"]}