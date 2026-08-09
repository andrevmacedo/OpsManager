from flask import Blueprint, current_app, jsonify, render_template, request

from app.services import login_service

login_bp = Blueprint("login", __name__)

@login_bp.route("/login")
def index():
    return render_template("login.html")