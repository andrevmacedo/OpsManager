from flask import (
    Blueprint,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from app.services import login_service

login_bp = Blueprint("login", __name__)

@login_bp.route("/login")
def index():
    # se já tem sessão ativa, não mostra o formulário de novo
    # não guarda a página de login no cache, pra não carregar ao voltar
    if session.get("usuario_id"):
        return redirect(url_for("operacoes.index"))
    response = make_response(render_template("login.html"))
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    return response

#digite Content-Type para saber se usará request.get_json() = 'application/json'
#body: JSON.stringify({ para saber o nome entre aspas do get
@login_bp.route("/login/acesso", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    resultado = login_service.autenticar(email, senha)
    if not resultado["ok"]:
        return jsonify(resultado), 401
    # aqui é "marcamos" que esse usuário está logado
    session["usuario_id"] = resultado["usuario"]["id"]
    session["usuario_nome"] = resultado["usuario"]["nome"]
    session["usuario_perfil"] = resultado["usuario"]["perfil"]
    return jsonify({"ok": True})
@login_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login.index"))