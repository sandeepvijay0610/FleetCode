from mongoengine import Document, StringField, IntField, DateTimeField
from datetime import datetime

class Squad(Document):
    squad_name = StringField(required=True, unique=True)
    score = IntField(default=0)
    streak = IntField(default=0)
    spotter_tokens = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)