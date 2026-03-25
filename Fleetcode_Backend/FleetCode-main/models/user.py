from mongoengine import (
    Document, StringField, ReferenceField,
    BooleanField, EmbeddedDocument, EmbeddedDocumentField, IntField
)
from models.squad import Squad

class Stats(EmbeddedDocument):
    Arrays = IntField(default=0)
    DP = IntField(default=0)
    Trees = IntField(default=0)
    Strings = IntField(default=0)
    Math = IntField(default=0)
    Graphs = IntField(default=0)


class User(Document):
    username = StringField(required=True, unique=True)
    squad = ReferenceField(Squad)
    daily_quota_met = BooleanField(default=False)
    stats = EmbeddedDocumentField(Stats, default=Stats)