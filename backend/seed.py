#Pietro, 01 de Junho
#Esse script preenche o banco de dados com dados de mentira para fins de teste..

import sys
import asyncio

#Fix para Windows
#Parece que o Windows fecha a aplicação antes de ela terminar
#Daí a gente tem que mudar a política de fechamento
if sys.platform == "win32":
	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import app.core.database as database
from sqlalchemy import text

from app.models.user import User
from app.models.ticket import Ticket
from app.models.comment import Comment

#from services.user_service import UserService
#from services.ticket_service import TicketService
#from services.comment_service import CommentService

async def esvazia_db():
	try:
		async with database.AsyncSessionLocal() as db:
			async with db.begin():
				await db.execute(text("TRUNCATE TABLE comments RESTART IDENTITY CASCADE"))
				await db.execute(text("TRUNCATE TABLE tickets RESTART IDENTITY CASCADE"))
				await db.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
	finally:
		await database.engine.dispose()

async def preenche_db():
	try:
		async with database.AsyncSessionLocal() as db:
			async with db.begin():
				################ Criar alguns usuários.
				db_user0 = User(matricula="242012345",	nome="André"	,email="andre@gmail.com",	senha_hash="12345678")
				db_user1 = User(matricula="242054321",	nome="Beatriz"	,email="beatr@gmail.com",	senha_hash="b1u9bda8")
				db_user2 = User(matricula="241023456",	nome="Caio"		,email="caioo@gmail.com",	senha_hash="182319ub")
				db_user3 = User(matricula="241065432",	nome="Danielle"	,email="danie@gmail.com",	senha_hash="ncaocah9")
				db_user4 = User(matricula="232076543",	nome="Ernesto"	,email="ernes@gmail.com",	senha_hash="10841bai")
				db_user5 = User(matricula="232034567",	nome="Fátima"	,email="fatim@gmail.com",	senha_hash="ancua812")
				db_user6 = User(matricula="231087654",	nome="Gabriel"	,email="gabri@gmail.com",	senha_hash="ncuqa9s1")
				db_user7 = User(matricula="231045678",	nome="Helena"	,email="helen@gmail.com",	senha_hash="qosdakpl")
				db_user8 = User(matricula="222098765",	nome="Iago"		,email="iagoo@gmail.com",	senha_hash="asd89a9c")
				db_user9 = User(matricula="222056789",	nome="Jussara"	,email="jussa@gmail.com",	senha_hash="cxnjonvr")
			
				db.add(db_user0)
				db.add(db_user1)
				db.add(db_user2)
				db.add(db_user3)
				db.add(db_user4)
				db.add(db_user5)
				db.add(db_user6)
				db.add(db_user7)
				db.add(db_user8)
				db.add(db_user9)

			async with db.begin():
			########## Criar alguns tickets.
				db_ticket0 = Ticket(solicitante_id=db_user0.matricula,	local="UED, MOCAP",		descricao="Datashow quebrado.",			tipo_manutencao="Tecnológico")
				db_ticket1 = Ticket(solicitante_id=db_user2.matricula,	local="LDTEA 2do PISO",	descricao="Buraco no teto.",			tipo_manutencao="Estrutural")
				db_ticket2 = Ticket(solicitante_id=db_user4.matricula,	local="UAC, S10",		descricao="A régua de energia estorou.",tipo_manutencao="Energia")
				db_ticket3 = Ticket(solicitante_id=db_user6.matricula,	local="RU, BANHEIROS",	descricao="A porta não tranca.",		tipo_manutencao="Estrutural")
			
				db.add(db_ticket0)
				db.add(db_ticket1)
				db.add(db_ticket2)
				db.add(db_ticket3)
		
			async with db.begin():
				############ Criar alguns comentários. 
				db_comment0 = Comment(mensagem="Tudo certo aqui.",			user_id=db_user1.matricula,	ticket_id=db_ticket0.id, ocultado=False)
				db_comment1 = Comment(mensagem="O problema está resolvido.",user_id=db_user3.matricula,	ticket_id=db_ticket1.id, ocultado=False)
				db_comment2 = Comment(mensagem="Está bom agora.",			user_id=db_user5.matricula,	ticket_id=db_ticket2.id, ocultado=False)
				db_comment3 = Comment(mensagem="Tudo OK.",					user_id=db_user7.matricula,	ticket_id=db_ticket3.id, ocultado=False)
				db_comment4 = Comment(mensagem="SIX SEVEN FORTY TWO !!!!",	user_id=db_user9.matricula,	ticket_id=db_ticket0.id, ocultado=True)
				db_comment5 = Comment(mensagem="Muito bom.",				user_id=db_user2.matricula,	ticket_id=db_ticket1.id, ocultado=False)
				db_comment6 = Comment(mensagem="Agora não falta mais nada.",user_id=db_user4.matricula,	ticket_id=db_ticket2.id, ocultado=False)
			
				db.add(db_comment0)
				db.add(db_comment1)
				db.add(db_comment2)
				db.add(db_comment3)
				db.add(db_comment4)
				db.add(db_comment5)
				db.add(db_comment6)

	finally:
		await database.engine.dispose()

if __name__ == "__main__":
	#Esvazia e preenche o banco de dados
	asyncio.run(esvazia_db())
	asyncio.run(preenche_db())