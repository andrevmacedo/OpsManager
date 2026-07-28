class Execucao:
    def __init__(self,idoperacao):
        self._idoperacao = idoperacao
        self._inicio = None
        self._fim = None
        self._duracao = None
        self._status = 'pendente'
        self._log = ''