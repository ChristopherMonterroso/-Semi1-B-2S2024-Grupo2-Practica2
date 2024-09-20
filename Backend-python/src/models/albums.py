from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
from models.user import User

class Album(Base):
    __tablename__ = 'albums'

    id_album = Column(Integer, primary_key=True, autoincrement=True)
    album_name = Column(String(255), nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)

    user = relationship('User', back_populates='album')
    images = relationship('Image', back_populates='album')

    def to_dict(self):
        return {
            'id_album': self.id_album,
            'album_name': self.album_name,
            'id_user': self.id_user,
            'user': self.user.to_dict() if self.user else None
        }
