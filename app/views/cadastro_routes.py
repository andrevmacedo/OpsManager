from flask import Blueprint, current_app, jsonify, render_template, request

from app.services import cadastro_service

cadastro_bp = Blueprint("cadastro", __name__)
@cadastro_bp.route("/cadastro")
def index():
    return render_template("cadastro.html")

@cadastro_bp.route("/cadastro/criar", methods=["POST"])
def criar():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    try:
        resultado = cadastro_service.cadastrar(nome,email,senha)
        status_code = 200 if resultado.get("ok") else 400
        return jsonify(resultado),status_code
    except Exception: 
        current_app.logger.exception("Erro inesperado na rota de operações")
        return jsonify({"ok": False, "erro": "Erro interno. Tente novamente."})
