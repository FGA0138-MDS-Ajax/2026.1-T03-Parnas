from typing import Any

from pydantic import BaseModel, Field


class ErrorItem(BaseModel):
    field: str | None = Field(
        default=None,
        description="Campo ou parâmetro associado à falha, quando aplicável.",
        examples=["body.local"],
    )
    message: str = Field(
        description="Descrição textual da falha.",
        examples=["Campo obrigatório."],
    )
    type: str | None = Field(
        default=None,
        description="Tipo técnico da validação, quando aplicável.",
        examples=["missing"],
    )


class ErrorResponse(BaseModel):
    detail: str = Field(
        description="Mensagem principal do erro em formato legível.",
        examples=["Falha na validação dos dados enviados."],
    )
    status_code: int = Field(
        description="Código HTTP retornado pela API.",
        examples=[400],
    )
    path: str = Field(
        description="Caminho da requisição que gerou o erro.",
        examples=["/api/v1/tickets"],
    )
    errors: list[ErrorItem] | None = Field(
        default=None,
        description="Lista de falhas específicas, usada principalmente em erros de validação.",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Falha na validação dos dados enviados.",
                    "status_code": 400,
                    "path": "/api/v1/tickets",
                    "errors": [
                        {
                            "field": "body.local",
                            "message": "Campo obrigatório.",
                            "type": "missing",
                        }
                    ],
                }
            ]
        }
    }


def error_response_docs(description: str) -> dict[str, Any]:
    return {
        "model": ErrorResponse,
        "description": description,
    }
