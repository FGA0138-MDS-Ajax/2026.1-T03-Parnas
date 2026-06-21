import pytest
import asyncio
from httpx import AsyncClient
from fastapi import status

from app.models.user import User

@pytest.mark.asyncio
async def test_concurrent_sessions_independence(
    client: AsyncClient, 
    test_solicitante: User, 
    solicitante_headers: dict[str, str],
    test_tecnico: User,
    tecnico_headers: dict[str, str]
):
    """
    Garante que múltiplas requisições simultâneas com tokens diferentes 
    (ex: abas diferentes no frontend enviando tokens distintos) 
    não interferem uma na outra no backend.
    Isso prova que não há variáveis globais guardando a sessão atual.
    """
    
    requests = []
    expected_results = []
    
    # 10 requisições de cada (20 requisições simultâneas intercaladas)
    for i in range(10):
        requests.append(client.get("/api/v1/users/me", headers=solicitante_headers))
        expected_results.append(test_solicitante.matricula)
        
        requests.append(client.get("/api/v1/users/me", headers=tecnico_headers))
        expected_results.append(test_tecnico.matricula)
        
    responses = await asyncio.gather(*requests)
    
    # Valida de forma pareada a resposta com o que era esperado pelo token
    for response, expected_matricula in zip(responses, expected_results):
        assert response.status_code == status.HTTP_200_OK
        json_data = response.json()
        assert json_data["matricula"] == expected_matricula
