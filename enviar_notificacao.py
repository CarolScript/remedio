
import requests
import firebase_admin
from firebase_admin import credentials, firestore

# 📌 Configuração do Firebase Admin SDK
cred = credentials.Certificate("remedios-meu-amor-firebase-adminsdk-fbsvc-b9c000802c.json")  # Baixe esse arquivo no Firebase Console
firebase_admin.initialize_app(cred)

db = firestore.client()

# 📌 Buscar o Token do Firestore
def buscar_tokens():
    tokens = []
    docs = db.collection("tokens").stream()

    for doc in docs:
        tokens.append(doc.to_dict()["token"])
    
    return tokens

# 📌 Enviar Notificação para todos os dispositivos cadastrados
def enviar_notificacao():
    tokens = buscar_tokens()
    if not tokens:
        print("❌ Nenhum Token encontrado!")
        return

    # 📌 Corpo da notificação
    data = {
        "registration_ids": tokens,  # Enviar para todos os dispositivos
        "notification": {
            "title": "🚨 Hora do Remédio!",
            "body": "Não esqueça de tomar seu remédio! 💊",
            "icon": "/icon.png"
        }
    }

    headers = {
        "Authorization": "12551340100",
        "Content-Type": "application/json",
    }

    response = requests.post("https://fcm.googleapis.com/fcm/send", json=data, headers=headers)
    print("✅ Notificação enviada com sucesso!", response.json())

# 📌 Testar enviando uma notificação agora
enviar_notificacao()
