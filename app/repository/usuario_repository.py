from database.conexao import get_connection


def verificar_senha(senha):
    db = get_connection()
    row = db.execute(
        "select id, nome, perfil from usuarios where senha = ?", (senha,)
    ).fetchone()
    return dict(row) if row else None