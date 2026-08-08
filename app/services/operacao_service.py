from app.models.operacao import Operacao
from app.repository import operacao_repository, usuario_repository


def listar():
    return operacao_repository.listar_todas()
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
    operacao_repository.criar_operacao(operacao, usuario["id"])
    return {"ok": True, "responsavel": usuario["nome"], "cor": None}
def excluir(id):
    operacao_repository.excluir_operacao(id)
    return {"ok": True, "mensagem": "Operação excluída com sucesso."}
def editar(id, nome, id_categoria, status, senha):
    usuario = usuario_repository.verificar_senha(senha)
    if not usuario:
        return {"ok": False, "erro": "Senha incorreta."}
    if usuario["perfil"] != "admin":
        return {"ok": False, "erro": "Apenas administradores podem editar operações."}
    operacao_repository.editar_operacao(id, nome, id_categoria, status)
    # busca os dados atualizados para retornar ao JS
    operacao = operacao_repository.buscar_porid(id)
    return {"ok": True, "categoria": operacao["categoria"], "cor": operacao["cor"]}