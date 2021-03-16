'''
Stores Model for our database
'''
from app import DB


class Player(DB.Model):
    '''Stores username and points for a player'''
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    points = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Player %r>' % self.username

