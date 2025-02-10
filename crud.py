from sqlalchemy.orm import Session
from models import User
from schemas import UserSchema

def create_user(db: Session, user: UserSchema):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(User).all()

def get_user_by_cpf(db: Session, cpf: str):
    return db.query(User).filter(User.cpf == cpf).first()

def update_user(db: Session, cpf: str, user_data: UserSchema):
    user = db.query(User).filter(User.cpf == cpf).first()
    if user:
        for key, value in user_data.dict().items():
            setattr(user, key, value)
        db.commit()
    return user

def delete_user(db: Session, cpf: str):
    user = db.query(User).filter(User.cpf == cpf).first()
    if user:
        db.delete(user)
        db.commit()
    return user
