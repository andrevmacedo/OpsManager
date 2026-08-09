from flask import Blueprint, current_app, jsonify, render_template, request

from app.services import login_service

login_bp = Blueprint("login", __name__)

@login_bp.route("/login")
def index():
    return render_template("login.html")

#digite Content-Type para saber se usará request.get_json() = 'application/json'
#body: JSON.stringify({ para saber o nome entre aspas do get
@login_bp.route("/login/acesso", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")