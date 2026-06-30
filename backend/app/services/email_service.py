import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings

class EmailService:
    @staticmethod
    def send_recovery_email(to_email: str, code: str) -> bool:
        """Envia um e-mail com o código de recuperação de senha."""
        smtp_server = settings.SMTP_HOST
        smtp_port = settings.SMTP_PORT
        sender_email = settings.SMTP_USER
        password = settings.SMTP_PASSWORD
        from_email = settings.SMTP_FROM

        if not all([smtp_server, smtp_port, sender_email, password]):
            print("Configurações de SMTP incompletas. E-mail não enviado.")
            return False

        message = MIMEMultipart("alternative")
        message["Subject"] = "Recuperação de Senha - Keep UnB"
        message["From"] = from_email
        message["To"] = to_email

        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <h2 style="color: #071A3E; margin-bottom: 20px;">Recuperação de Senha</h2>
              <p>Olá,</p>
              <p>Você solicitou a recuperação de senha no <strong>Keep UnB</strong>.</p>
              <p>Utilize o código abaixo para prosseguir com a redefinição de sua senha:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px; color: #1B7A3A; background-color: #f4f4f4; padding: 10px 20px; border-radius: 8px;">
                  {code}
                </span>
              </div>
              <p>Este código é válido por <strong>15 minutos</strong> e é de uso único.</p>
              <p>Se você não solicitou esta alteração, por favor ignore este e-mail.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
              <p style="font-size: 12px; color: #777; text-align: center;">Equipe Keep UnB</p>
            </div>
          </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, to_email, message.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"Erro ao enviar e-mail: {e}")
            return False
