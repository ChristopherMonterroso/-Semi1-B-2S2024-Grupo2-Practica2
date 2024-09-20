from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
from models.albums import Album

class Image(Base):
    __tablename__ = 'images'

    id_image = Column(Integer, primary_key=True, autoincrement=True)
    image_name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    image_url = Column(String(255), nullable=False)
    id_album = Column(Integer, ForeignKey('albums.id_album'), nullable=False)

    album = relationship('Album', back_populates='images')

    def to_dict(self):
        return {
            'id_image': self.id_image,
            'image_name': self.image_name,
            'description': self.description,
            'image_url': self.image_url,
            'id_album': self.id_album,
            'album': self.album.to_dict() if self.album else None
        }
