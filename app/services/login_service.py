import bcrypt

from app.repository import usuario_repository


def autenticar(email,senha):
    usuario = usuario_repository.verificar_email(email)
    if not usuario:
        return {"ok": False, "erro": "E-mail ou senha inválidos."}
    senha_confere = bcrypt.checkpw(senha.encode('utf-8'), usuario["senha"])
    if not senha_confere:
        return {"ok": False, "erro": "E-mail ou senha inválidos."}
    return {"ok": True, "usuario": {"id": usuario["id"], "nome": usuario["nome"], "perfil": usuario["perfil"]}}