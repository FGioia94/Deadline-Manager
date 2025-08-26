import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_email(receiver_email, subject, message):
    smtp_server = "pro3.mail.ovh.net"  
    smtp_port = 587  
    sender_email = os.getenv("OVH_EMAIL")
    password = os.getenv("OVH_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject

    msg.attach(MIMEText(message, "html")) 

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("✅ Email sent successfully!")
    except Exception as e:
        print("❌ Error sending email:", e)

def send_confirmation_email(receiver_email, token):
    confirmation_link = f"http://localhost:5173/confirm/{token}"
    message = f"""
    <html>
        <body>
            <p>Welcome! Click the button below to confirm your registration:</p>
            <a href="{confirmation_link}"
            style="display:inline-block; padding:10px 20px; font-size:16px;
            color:white; background-color:#007BFF; text-decoration:none;
            border-radius:5px;">
            Confirm Registration
            </a>
        </body>
    </html>"""
    send_email(receiver_email, "Confirm your Account", message)