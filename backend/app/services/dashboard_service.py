import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import TicketStatus
from app.models.user import ApprovalStatus
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardSummaryResponse, DesempenhoTecnico

class DashboardService:
    @staticmethod
    async def get_summary(db: AsyncSession) -> DashboardSummaryResponse:
        ticket_counts, tech_counts, type_counts, perf_data = await asyncio.gather(
            DashboardRepository.get_ticket_counts_by_status(db),
            DashboardRepository.get_technician_counts(db),
            DashboardRepository.get_ticket_counts_by_type(db),
            DashboardRepository.get_technician_performance(db)
        )

        chamados_abertos = ticket_counts.get(TicketStatus.ABERTO.value, 0)
        chamados_atribuidos = ticket_counts.get(TicketStatus.ATRIBUIDO.value, 0)
        chamados_em_andamento = ticket_counts.get(TicketStatus.EM_ANDAMENTO.value, 0)
        chamados_concluidos = ticket_counts.get(TicketStatus.CONCLUIDO.value, 0)

        tecnicos_ativos = tech_counts.get(ApprovalStatus.APROVADO.value, 0)
        tecnicos_pendentes = tech_counts.get(ApprovalStatus.PENDENTE.value, 0)

        desempenho_tecnicos = []
        for row in perf_data:
            atribuidos_ativos = row.atribuidos_ativos or 0
            concluidos = row.concluidos or 0
            total_atendidos = atribuidos_ativos + concluidos
            
            eficiencia = 0.0
            if total_atendidos > 0:
                eficiencia = round((concluidos / total_atendidos) * 100, 2)
            
            desempenho_tecnicos.append(
                DesempenhoTecnico(
                    nome_tecnico=row.nome,
                    matricula=row.matricula,
                    atribuidos_ativos=atribuidos_ativos,
                    concluidos=concluidos,
                    total_atendidos=total_atendidos,
                    eficiencia=eficiencia
                )
            )

        return DashboardSummaryResponse(
            chamados_abertos=chamados_abertos,
            chamados_atribuidos=chamados_atribuidos,
            chamados_em_andamento=chamados_em_andamento,
            chamados_concluidos=chamados_concluidos,
            tecnicos_ativos=tecnicos_ativos,
            tecnicos_pendentes=tecnicos_pendentes,
            chamados_por_tipo=type_counts,
            desempenho_tecnicos=desempenho_tecnicos
        )
