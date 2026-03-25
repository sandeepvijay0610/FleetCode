from mongoengine import *

def init_db():
    connect(
        db="testDB",
        host="mongodb+srv://user:Eo1Ed2Zf6Ezwjhmk@cluster0.jryent.mongodb.net/?appName=Cluster0"
    )
    try:
        conn = get_connection()
        conn.admin.command("ping")
        print("Connected!")
    except Exception as e:
        print("Not connected:", e)

# init_db()
