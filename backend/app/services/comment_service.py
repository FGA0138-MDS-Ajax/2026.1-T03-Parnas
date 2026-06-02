# Pietro, 31 de Maio

# O Service é onde a gente soca toda a lógica de negócio, eu acho

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole
from app.models.comment import Comment

from app.repositories.ticket_repository import TicketRepository
from app.repositories.user_repository import UserRepository
from app.repositories.comment_repository import CommentRepository

from app.schemas.comment import CommentCreate

# Aqui fica a lógica de negócio do sistema de comentários
# Vou detalhar como acho que deveria funcionar
#   Usuário pode criar um comentário sob um ticket
#   Um usuário administrador (TODO) pode ocultar um comentário ofensivo
# Bem simples

class CommentService:

    #Criar um comentário
    #Eu passo como argumentos:
    #   A sessão de banco de dados
    #   Payload de comentário 'comment_in' com dados sobre o comentário
    #   Usuário autor, classe Python
    #   Ticket asocciado, classe Python
    @staticmethod
    async def create_comment(
        db: AsyncSession, 
        comment_in: CommentCreate, 
        user: User,
        ticket: int
        ) -> Comment:
        return await CommentRepository.create(db, comment_in, user.matricula, ticket.id)

    #Obter os comentários de um usuário
    async def get_user_comments(
        db: AsyncSession,
        user_id: str
        ) -> Comment:

        return await CommentRepository.get_by_matricula(db, user_id)

    #Obter os comentários de um ticket
    async def get_ticket_comments(
        db: AsyncSession,
        ticket_id: int
        ) -> Comment:

        return await CommentRepository.get_by_ticket_id(db, ticket_id)

    #Ocultar/revelar um comentário
    #Eu passo como argumentos:
    #   A sessão de banco de dados
    #   O ID do comentário alvo
    #   Bool se diz se é para revelar ou não
    #   (TODO), também incluir quem (admin) mexeu no comentário
    @staticmethod
    async def update_comment_ocultado(
        db: AsyncSession,
        comment_id: int,
        ocultar: bool,
        #user_id: str,
        ):

        #Pega o comentário como classe Python pelo repositório
        comment = await CommentRepository.get_by_id(db, comment_id)

        #Se não achar o comentário pelo ID, taca um erro
        if not comment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comentário não encontrado")

        #TODO -- verificar se quem pediu para ocultar/revelar o comentário é autorizado
        #if ???:
        #   raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
        #       detail="Usuário não tem permissão para ocultar/revelar comentário.")

        #Oculta ou revela o comentário
        comment.ocultado = ocultar

        #Atualiza o banco de dados pelo repository
        return await CommentRepository.update(db, comment)
