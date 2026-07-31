from app.models.operacao import Operacao
from app.repository import operacao_repository, usuario_repository


def listar():
    return operacao_repository.listar_todas()
def buscar(id):
    return operacao_repository.buscar_porid(id)
def criar(nome, descricao, id_categoria, senha):
    # verifica se a senha corresponde a algum usuário ativo
    usuario = usuario_repository.verificar_senha(senha)
    if not usuario:
        return {"ok": False, "erro": "Senha incorreta."}
    operacao = Operacao(nome, descricao, id_categoria)
    operacao_repository.criar_operacao(operacao)
    return {"ok": True, "responsavel": usuario["nome"], "cor": None}