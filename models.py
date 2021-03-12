'''
Stores Model for our database
'''
from app import db


class Player(db.Model):
    '''Stores username and points for a player'''
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    points = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Player %r>' % self.username


db.create_all()
