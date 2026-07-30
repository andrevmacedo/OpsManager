from flask import Blueprint, redirect, render_template, request, url_for

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
    # extrai os dados enviados pelo formulário HTML
    # request.form é um dicionário com os campos do <form>
    nome = request.form.get("nome")
    descricao = request.form.get("descricao")
    id_categoria = request.form.get("id_categoria")
    # passa os dados para o service processar e salvar no banco
    operacao_service.criar(nome, descricao, id_categoria)
    # redireciona de volta para a lista após criar
    # url_for("operacoes.index") gera a URL /operacoes
    return redirect(url_for("operacoes.index"))
# GET /operacoes/<id> — busca uma operação específica pelo id
# <int:id> — o Flask converte o valor da URL para inteiro automaticamente
@operacao_bp.route("/operacoes/<int:id>")
def detalhe(id):
    # busca a operação pelo id via service
    operacao = operacao_service.buscar(id)
    # se não encontrar, retorna 404
    if not operacao:
        return "Operação não encontrada!", 404
    # renderiza o template passando a operação encontrada
    return render_template("operacao_detalhe.html", operacao=operacao)