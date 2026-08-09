from database.conexao import get_connection


def verificar_senha(senha):
    db = get_connection()
    row = db.execute(
        "select id, nome, perfil from usuarios where senha = ?", (senha,)
    ).fetchone()
    return dict(row) if row else None
def verificar_email(email):
    db = get_connection()
    row = db.execute("select * from usuarios where email = ?",(email,)).fetchone()
    return dict(row) if row else None
def cadastrar_usuario(usuario):
    db = get_connection()
    db.execute("insert into usuarios (nome,email,senha,perfil) values (?,?,?,?)",(usuario._nome,usuario._email,usuario._senha,usuario._perfil))
    db.commit()