from app import create_app  # importa a função que cria e configura o Flask

app = create_app()  # cria a instância da aplicação
if __name__ == "__main__":
    # só executa o servidor se esse arquivo for rodado diretamente
    # py run.py → sobe o servidor
    # se outro arquivo importar o run.py → não sobe
    app.run(debug=True)  # debug=True reinicia automaticamente ao salvar