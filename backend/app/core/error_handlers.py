import logging
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def register_error_handlers(app: FastAPI) -> None:
    """Registra handlers globais para manter o contrato de erro da API."""

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        detail = _normalize_detail(exc.detail, exc.status_code)
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": detail,
                "status_code": exc.status_code,
                "path": request.url.path,
            },
            headers=getattr(exc, "headers", None),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "detail": "Falha na validação dos dados enviados.",
                "status_code": status.HTTP_400_BAD_REQUEST,
                "path": request.url.path,
                "errors": [_format_validation_error(error) for error in exc.errors()],
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        logger.exception("Unhandled backend error at %s", request.url.path, exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Erro interno inesperado.",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "path": request.url.path,
            },
        )


def _normalize_detail(detail: Any, status_code: int) -> str:
    if isinstance(detail, str) and detail:
        return _translate_default_detail(detail, status_code)
    return _default_detail_for_status(status_code)


def _default_detail_for_status(status_code: int) -> str:
    details = {
        status.HTTP_400_BAD_REQUEST: "Requisição inválida.",
        status.HTTP_401_UNAUTHORIZED: "Autenticação necessária.",
        status.HTTP_403_FORBIDDEN: "Você não tem permissão para realizar esta operação.",
        status.HTTP_404_NOT_FOUND: "Recurso não encontrado.",
    }
    return details.get(status_code, "Erro ao processar a requisição.")


def _translate_default_detail(detail: str, status_code: int) -> str:
    default_translations = {
        "Not authenticated": "Token de autenticação não informado.",
        "Invalid authentication credentials": "Credenciais de autenticação inválidas.",
        "Not Found": "Recurso não encontrado.",
        "Method Not Allowed": "Método HTTP não permitido para este recurso.",
    }
    if detail in default_translations:
        return default_translations[detail]
    if status_code == status.HTTP_403_FORBIDDEN and detail == "Forbidden":
        return "Você não tem permissão para realizar esta operação."
    return detail


def _format_validation_error(error: dict[str, Any]) -> dict[str, str | None]:
    error_type = str(error.get("type", "validation_error"))
    return {
        "field": ".".join(str(part) for part in error.get("loc", [])),
        "message": _validation_message(error),
        "type": error_type,
    }


def _validation_message(error: dict[str, Any]) -> str:
    error_type = str(error.get("type", ""))
    if error_type == "missing":
        return "Campo obrigatório."
    if error_type.startswith("string_too_short"):
        min_length = error.get("ctx", {}).get("min_length")
        if min_length is not None:
            return f"Deve possuir pelo menos {min_length} caracteres."
    if error_type.startswith("string_too_long"):
        max_length = error.get("ctx", {}).get("max_length")
        if max_length is not None:
            return f"Deve possuir no máximo {max_length} caracteres."
    if error_type == "value_error":
        ctx_error = error.get("ctx", {}).get("error")
        if ctx_error:
            return str(ctx_error)
    return str(error.get("msg", "Valor inválido."))
