import os
import sys

# adiciona a raiz do projeto ao caminho de busca do Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()
if __name__ == "__main__":
    app.run(debug=True)