from database.conexao import get_connection


def listar_categorias():
    db = get_connection()
    rows = db.execute("select * from categorias order by nome").fetchall()
    return [dict(row) for row in rows]
    