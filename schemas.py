from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Annotated
from datetime import date

class UserSchema(BaseModel):
    cpf: str
    name: str
    email: EmailStr
    birth_date: date
    street: str
    number: str
    neighborhood: str
    city: str
    state: str
    phone: str
    workload: int

    class Config:
        orm_mode = True
