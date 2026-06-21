from pydantic import BaseModel

class TicketTypeCount(BaseModel):
    tipo_manutencao: str
    quantidade: int

class DesempenhoTecnico(BaseModel):
    nome_tecnico: str
    matricula: str
    atribuidos_ativos: int
    concluidos: int
    total_atendidos: int
    eficiencia: float

class DashboardSummaryResponse(BaseModel):
    chamados_abertos: int
    chamados_atribuidos: int
    chamados_em_andamento: int
    chamados_concluidos: int
    tecnicos_ativos: int
    tecnicos_pendentes: int
    chamados_por_tipo: list[TicketTypeCount]
    desempenho_tecnicos: list[DesempenhoTecnico]
