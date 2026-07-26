import os

from dotenv import load_dotenv
from flask import Flask

load_dotenv()  # carrega as variáveis do arquivo .env para o os.getenv funcionar

def create_app():
    # cria a aplicação Flask
    # template_folder → onde ficam os HTMLs (Jinja2)
    # static_folder   → onde ficam CSS, JS e imagens
    app = Flask(__name__, template_folder="../templates", static_folder="../static")

    # define a chave secreta usada para proteger sessões e cookies
    # vem do .env — nunca hardcoded no código
    app.secret_key = os.getenv("SECRET_KEY")

    return app