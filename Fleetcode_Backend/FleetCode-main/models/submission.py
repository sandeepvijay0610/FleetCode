from mongoengine import (
    Document, StringField, ReferenceField,
    ListField, DateTimeField, BooleanField
)
from datetime import datetime
from models.squad import Squad

class Submission(Document):
    username = StringField(required=True)
    squad = ReferenceField(Squad)

    problem_name = StringField(required=True)
    difficulty = StringField(choices=["Easy", "Medium", "Hard"])

    topic_tags = ListField(StringField())
    timestamp = DateTimeField(default=datetime.utcnow)

    is_spotter_solve = BooleanField(default=False)

    meta = {
        "indexes": ["username", "-timestamp"]
    }