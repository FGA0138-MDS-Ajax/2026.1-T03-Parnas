# Pietro, 31 de Maio

# O repository serve para abstrair o acesso ao banco de dados, tanto GET quanto SET.
# O repository é importado pelo service.

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comment import Comment
from app.schemas.comment import CommentCreate#TODO

class CommentRepository:
    #Criar comentário no banco de dados.
    #São passados: 
    #   A sessão de banco de dados,
    #   O payload 'comment_in' com os dados sobre o comentário,
    #   O ID do ticket onde o comentário está anexado e o ID do usuário autor do comentário
    @staticmethod
    async def create(
        db: AsyncSession, 
        comment_in: CommentCreate, 
        ticket_id: int,
        user_id: str
        ) -> Comment:

        db_comment = Comment(
            mensagem=comment_in.mensagem,
            ocultado=comment_in.ocultado,
            ticket_id=ticket_id,
            user_id=user_id
        )

        #   Comentei essa parte pois achei redundante
        #   O mesmo está escrito em 'self.update()'
        self.update(db, db_comment)
        #db.add(db_ticket)
        #await db.commit()
        #await db.refresh(db_ticket)

        return db_ticket

    #Obter comentário por ID.
    @staticmethod
    async def get_by_id(
        db: AsyncSession, 
        comment_id: int
        ) -> Comment | None:

        result = await db.execute(select(Comment).where(Comment.id == comment_id))
        return result.scalars().first()

    #Atualizar comentário no banco de dados.
    @staticmethod
    async def update(
        db: AsyncSession,
        db_comment: Comment
        ) -> Comment:

        db.add(db_comment)
        await db.commit()
        await db.refresh(db_comment)
        return db_comment
