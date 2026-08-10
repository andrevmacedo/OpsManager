from flask import (
    Blueprint,
    current_app,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from app.services import operacao_service

# Blueprint agrupa todas as rotas de operações num módulo separado
# "operacoes" é o nome do grupo — usado no url_for("operacoes.index")
operacao_bp = Blueprint("operacoes", __name__)

# GET /operacoes — lista todas as operações
@operacao_bp.route("/operacoes")
def index():
    # bloqueia acesso de quem não está logado (proteção real, não só visual)
    if not session.get("usuario_id"):
        return redirect(url_for("login.index"))
    operacoes = operacao_service.listar()
    # busca as categorias para popular os <select> dos formulários
    categorias = operacao_service.listar_categorias()
    # renderiza o template passando as operações e categorias como variáveis
    response = make_response(render_template("operacoes.html", operacoes=operacoes, categorias=categorias))
    # impede o navegador de guardar essa página em cache (bfcache) após logout
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    return response
# POST /operacoes/criar — recebe os dados do formulário e cria uma nova operação
# methods=["POST"] — só aceita requisições POST, não GET
@operacao_bp.route("/operacoes/criar", methods=["POST"])
def criar():
    # extrai os dados enviados pelo fetch no JavaScript
    nome         = request.form.get("nome")
    descricao    = request.form.get("descricao")
    id_categoria = request.form.get("id_categoria")
    senha        = request.form.get("senha")  # usada para confirmar identidade do usuário
    try:
        # service valida a senha e cria a operação
        # retorna dict com ok, responsavel e cor
        resultado = operacao_service.criar(nome, descricao, id_categoria, senha)
        return jsonify(resultado)  # devolve JSON para o JavaScript processar
    except Exception: 
        # se qualquer erro ocorrer, devolve JSON com erro em vez de HTML
        # sem isso o fetch receberia HTML e quebraria com "Erro de conexão"
        current_app.logger.exception("Erro inesperado na rota de operações")
        return jsonify({"ok": False, "erro": "Erro interno. Tente novamente."})
# GET /operacoes/<id> — busca uma operação específica pelo id
# <int:id> — o Flask converte o valor da URL para inteiro automaticamente
@operacao_bp.route("/operacoes/listar")
def atualizar():
    operacoes = operacao_service.listar()
    return jsonify(operacoes)  # ← JSON
@operacao_bp.route("/operacoes/<int:id>/excluir", methods=["POST"])
def excluir(id):
    try:
        resultado = operacao_service.excluir(id)
        return jsonify(resultado)
    except Exception:
        current_app.logger.exception("Erro inesperado na rota de operações")
        return jsonify({"ok": False, "erro": "Erro interno. Tente novamente."})
@operacao_bp.route("/operacoes/<int:id>/editar", methods=["POST"])
def editar(id):
    nome         = request.form.get("nome")
    id_categoria = request.form.get("id_categoria")
    status       = request.form.get("status")
    senha        = request.form.get("senha")
    try:
        resultado = operacao_service.editar(id, nome, id_categoria, status, senha)
        return jsonify(resultado)
    except Exception:
        current_app.logger.exception("Erro inesperado na rota de operações")
        return jsonify({"ok": False, "erro": "Erro interno. Tente novamente."})