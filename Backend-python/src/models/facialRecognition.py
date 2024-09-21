from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
from models.user import User

class FacialRecognition(Base):
    __tablename__ = 'facial_recognition'

    id_facial_recognition = Column(Integer, primary_key=True, autoincrement=True)
    facial_image_url = Column(String(255), nullable=False)
    status = Column(Boolean, nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)

    user = relationship('User', back_populates='facial_recognition')

    def to_dict(self):
        return {
            'id_facial_recognition': self.id_facial_recognition,
            'facial_image_url': self.facial_image_url,
            'status': self.status,
            'id_user': self.id_user,
            'user': self.user.to_dict() if self.user else None
        }

User.facial_recognition = relationship('FacialRecognition', back_populates='user')
