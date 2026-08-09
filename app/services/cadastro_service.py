import sqlite3

import bcrypt

from app.models.usuario import Usuario
from app.repository import usuario_repository


def cadastrar(nome,email,senha):
    if usuario_repository.verificar_email(email):
        return {"ok": False, "erro": "Usuário já cadastrado!"}
    if not "@opsmanager.com" in email:
        return {"ok": False, "erro": "Erro. Utilize um email corporatiivo!"}
    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
    usuario = Usuario(nome,email,senha_hash)
    try:
        usuario_repository.cadastrar_usuario(usuario)
    except sqlite3.IntegrityError:
            return {"ok": False, "erro": "Erro ao cadastrar usuário."}
    return {"ok": True, "mensagem": "Usuário cadastrado com sucesso!"}
    