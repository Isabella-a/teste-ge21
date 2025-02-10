from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserSchema
import crud

router = APIRouter()

@router.post("/users/")
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    if crud.get_user_by_cpf(db, user.cpf):
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    return crud.create_user(db, user)

@router.get("/users/")
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@router.get("/users/{cpf}")
def get_user(cpf: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_cpf(db, cpf)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/users/{cpf}")
def update_user(cpf: str, user: UserSchema, db: Session = Depends(get_db)):
    return crud.update_user(db, cpf, user)

@router.delete("/users/{cpf}")
def delete_user(cpf: str, db: Session = Depends(get_db)):
    return crud.delete_user(db, cpf)
