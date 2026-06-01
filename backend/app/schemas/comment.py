# Pietro, 31 de Maio

# O schema serve para validar os dados que passam pela rede, aparentemente

from datetime import datetime
from pydantic import BaseModel, EmailStr
#from app.models.comments import CommentStatus #Protótipo de esconder comentários ofensivos

# Base: propriedades básicas do comentário
#       não inclui propriedades geradas proceduralmente, como IDs ou tempo/data
class CommentBase():
    mensagem: str
    ocultado: bool

# Create:   Cria o comentário
#           Fica vazio de propósito
class CommentCreate(CommentBase):
    pass

# Response: Adiciona metadados como IDs ou tempo/data
#           model_config serve para configurar o Pydantic associado ao SQLAlchemy
class CommentResponse(CommentBase):
    id: str
    ticket_id: int
    user_id: str
    created_at: datetime

    model_config = {"from_attributes": True}

# Update:   Atualiza propriedades básicas do comentário
#           Fazemos ... | None para que seja opcional alterar algum dado
#
#           Não herda CommentBase pelo mesmo motivo
class CommentUpdate(BaseModel):
    mensagem: str | None = None
    ocultado: bool | None = None

