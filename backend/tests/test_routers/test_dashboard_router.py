import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_dashboard_summary_unauthorized(client: AsyncClient, solicitante_headers: dict[str, str], tecnico_headers: dict[str, str]):
    """Garante que Solicitantes e Técnicos não têm acesso ao dashboard."""
    # Sem auth
    resp = await client.get("/api/v1/dashboard/summary")
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    
    # Solicitante
    resp = await client.get("/api/v1/dashboard/summary", headers=solicitante_headers)
    assert resp.status_code == status.HTTP_403_FORBIDDEN
    
    # Técnico
    resp = await client.get("/api/v1/dashboard/summary", headers=tecnico_headers)
    assert resp.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.asyncio
async def test_dashboard_summary_gerente(client: AsyncClient, gerente_headers: dict[str, str], create_test_ticket, test_solicitante, test_tecnico):
    """Garante que o Gerente consegue obter as estatísticas corretamente, validando a lógica matemática do backend."""
    
    # Simulando um cenário de banco de dados
    await create_test_ticket(
        local="L1", tipo_manutencao="Eletrica", descricao="D1", solicitante_id=test_solicitante.matricula, status="ABERTO"
    )
    await create_test_ticket(
        local="L2", tipo_manutencao="Eletrica", descricao="D2", solicitante_id=test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status="ATRIBUIDO"
    )
    await create_test_ticket(
        local="L3", tipo_manutencao="Hidraulica", descricao="D3", solicitante_id=test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status="CONCLUIDO"
    )

    resp = await client.get("/api/v1/dashboard/summary", headers=gerente_headers)
    assert resp.status_code == status.HTTP_200_OK
    
    data = resp.json()
    assert data["chamados_abertos"] == 1
    assert data["chamados_atribuidos"] == 1
    assert data["chamados_concluidos"] == 1
    assert data["tecnicos_ativos"] >= 1  # Pode haver mais criados por outras fixtures
    
    # Validação do cálculo de eficiência de performance (Task 6 adendo)
    perf = [t for t in data["desempenho_tecnicos"] if t["matricula"] == test_tecnico.matricula]
    assert len(perf) == 1
    tec_perf = perf[0]
    
    # Tem 1 Atribuído e 1 Concluído -> Total = 2. Eficiência = 1 / 2 = 50%
    assert tec_perf["atribuidos_ativos"] == 1
    assert tec_perf["concluidos"] == 1
    assert tec_perf["total_atendidos"] == 2
    assert tec_perf["eficiencia"] == 50.0
