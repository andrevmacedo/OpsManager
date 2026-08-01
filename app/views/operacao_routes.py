from flask import Blueprint, jsonify, render_template, request

from app.services import operacao_service

# Blueprint agrupa todas as rotas de operações num módulo separado
# "operacoes" é o nome do grupo — usado no url_for("operacoes.index")
operacao_bp = Blueprint("operacoes", __name__)

# GET /operacoes — lista todas as operações
@operacao_bp.route("/operacoes")
def index():
    # busca todas as operações via service
    operacoes = operacao_service.listar()
    # renderiza o template passando as operações como variável
    # no HTML: {% for op in operacoes %}
    return render_template("operacoes.html", operacoes=operacoes)
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
    except Exception as e:  # noqa: BLE001
        # se qualquer erro ocorrer, devolve JSON com erro em vez de HTML
        # sem isso o fetch receberia HTML e quebraria com "Erro de conexão"
        return jsonify({"ok": False, "erro": str(e)})
# GET /operacoes/<id> — busca uma operação específica pelo id
# <int:id> — o Flask converte o valor da URL para inteiro automaticamente
@operacao_bp.route("/operacoes/listar")
def atualizar():
    operacoes = operacao_service.listar()
    return jsonify(operacoes)  # ← JSON
@operacao_bp.route("/operacoes/<int:id>")
def detalhe(id):
    # busca a operação pelo id via service
    operacao = operacao_service.buscar(id)
    # se não encontrar, retorna 404
    if not operacao:
        return "Operação não encontrada!", 404
    # renderiza o template passando a operação encontrada
    return render_template("operacao_detalhe.html", operacao=operacao)
@operacao_bp.route("/operacoes/<int:id>/excluir", methods=["POST"])
def excluir(id):
    try:
        resultado = operacao_service.excluir(id)
        return jsonify(resultado)
    except Exception as e:  # noqa: BLE001
        return jsonify({"ok": False, "erro": str(e)})
