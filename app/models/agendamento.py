class Agendamento:
    def __init__(self,idoperacao,frequencia,proxima_execucao):
        self._idoperacao = idoperacao
        self._frequencia = frequencia
        self._proxima_execucao = proxima_execucao
        self._ativo = True