#Pietro, 01 de Junho
#Esse script preenche o banco de dados com dados de mentira para fins de teste.

import asyncio
import core.database as database

from models.user import User
from models.ticket import Ticket
from models.comment import Comment

async def preenche_db():
	session = database.get_db()
	async with session.begin():

		# Criar alguns usuários.
		session.add(User(

		))

		# Criar alguns tickets.
		session.add(Ticket(
			
		))

		#Dá flush para que os usuários e tickets sejam assinalados um ID (pq??)
		session.flush()

		# Criar alguns comentários. 
		session.add(Comment(
			
		))

if __name__ == "__main__":
    asyncio.run(preenche_db())