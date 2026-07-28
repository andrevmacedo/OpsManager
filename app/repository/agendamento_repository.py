from database.conexao import get_connection


def listar_ativos():
    db = get_connection()
    return db.execute("select * from agendamentos where ativo = 1").fetchall()
def buscar_proximas_execucoes():
    db = get_connection()
    return db.execute("select * from agendamentos order by proxima_execucao asc").fetchall()