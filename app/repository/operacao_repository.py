from database.conexao import get_connection

db = get_connection()
def listar_todar():
    return db.execute("select * from operacoes").fetchall()
def buscar_porid(id):
    return db.execute("select * from operacoes where id = ?",(id,)).fetchone()
def criar_operacao(operacao):
    db.execute(
    "INSERT INTO operacoes (nome, descricao, id_categoria, status) VALUES (?,?,?,?)",
    (operacao._nome, operacao._descricao, operacao._idcategoria, operacao._status))
    db.commit()