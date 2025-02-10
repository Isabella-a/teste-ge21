from sqlalchemy import Column, String, Date, Integer
from database import Base

class User(Base):
    __tablename__ = "users"

    cpf = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    street = Column(String, nullable=False)
    number = Column(String, nullable=False)
    neighborhood = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    workload = Column(Integer, nullable=False)
