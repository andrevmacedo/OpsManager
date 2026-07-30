from database.conexao import get_connection


def listar_todas():
    db = get_connection()
    return db.execute("select * from operacoes").fetchall()
def buscar_porid(id):
    db = get_connection()
    return db.execute("select * from operacoes where id = ?",(id,)).fetchone()
def criar_operacao(operacao):
    db = get_connection()
    db.execute(
    "insert into operacoes (nome, descricao, id_categoria, status) VALUES (?,?,?,?)",
    (operacao._nome, operacao._descricao, operacao._id_categoria, operacao._status))
    db.commit()