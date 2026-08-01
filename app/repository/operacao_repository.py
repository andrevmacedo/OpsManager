from database.conexao import get_connection


def listar_todas():
    db = get_connection()
    rows = db.execute('''
        select 
            op.id,
            op.nome,
            op.descricao,
            op.status,
            op.criado_em,
            categorias.nome as categoria,
            usuarios.nome as responsavel
        from operacoes op
        inner join categorias on op.id_categoria = categorias.id
        inner join usuarios on op.id_usuario = usuarios.id
    ''').fetchall()
    return [dict(row) for row in rows]
def buscar_porid(id):
    db = get_connection()
    row = db.execute("select * from operacoes where id = ?",(id,)).fetchone()
    return dict(row) if row else None
def criar_operacao(operacao, id_usuario):
    db = get_connection()
    db.execute(
        "insert into operacoes (nome, descricao, id_categoria, id_usuario, status) VALUES (?,?,?,?,?)",
        (operacao._nome, operacao._descricao, operacao._id_categoria, id_usuario, operacao._status)
    )
    db.commit()
def excluir_operacao(id):
    db = get_connection()
    db.execute("delete from operacoes where id = ?",(id,))
    db.commit()