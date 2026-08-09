from flask import Blueprint, current_app, jsonify, render_template, request

cadastro_bp = Blueprint("cadastro", __name__)
@cadastro_bp.route("/cadastro")
def index():
    return render_template("cadastro.html")

@cadastro_bp.route("/cadastro/criar", methods=["POST"])
def criar():
    pass
