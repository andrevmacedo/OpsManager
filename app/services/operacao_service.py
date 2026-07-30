from app.models.operacao import Operacao
from app.repository import operacao_repository


def listar():
    return operacao_repository.listar_todas()
def buscar(id):
    return operacao_repository.buscar_porid(id)
def criar(nome,descricao,id_categoria):
    operacao = Operacao(nome,descricao,id_categoria)
    operacao_repository.criar_operacao(operacao)