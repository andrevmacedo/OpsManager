from database.conexao import get_connection


def registrar_execucao(execucao):
    db = get_connection()
    db.execute("insert into execucoes (id_operacao,inicio,fim,duracao,status,log) values (?,?,?,?,?,?)",
               (execucao._idoperacao,execucao._inicio,execucao._fim,execucao._duracao,execucao._status,execucao._log))
    db.commit()
def listar_operacao(idoperacao):
    db = get_connection()
    return db.execute("select * from execucoes where id_operacao = ?",(idoperacao,)).fetchall()
def buscar_ultima_execucao():
    db = get_connection()
    return db.execute("select * from execucoes order by id desc limit 1").fetchone()