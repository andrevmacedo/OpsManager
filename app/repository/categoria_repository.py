from database.conexao import get_connection


def listar_categorias():
    db = get_connection()
    return db.execute("select * from categorias").fetchall()
    