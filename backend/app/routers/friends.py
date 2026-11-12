from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Friendship, MoodEntry
from ..schemas import FriendInfo, FriendRequest, MoodEntryOut
from ..auth import get_current_user

router = APIRouter(prefix="/friends", tags=["friends"])

@router.get("", response_model=list[FriendInfo])
def get_friends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    friendships = db.query(Friendship).filter(Friendship.user_id == current_user.id).all()
    friend_ids = [f.friend_id for f in friendships]
    if not friend_ids:
        return []
    return db.query(User).filter(User.id.in_(friend_ids)).all()

@router.post("", response_model=FriendInfo)
def add_friend(payload: FriendRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.friend_email == current_user.email:
        raise HTTPException(status_code=400, detail="Нельзя добавить себя")
    
    friend = db.query(User).filter(User.email == payload.friend_email).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    existing = db.query(Friendship).filter(
        Friendship.user_id == current_user.id,
        Friendship.friend_id == friend.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Уже в друзьях")
    
    # Добавляем в друзья в обе стороны
    db.add(Friendship(user_id=current_user.id, friend_id=friend.id))
    db.add(Friendship(user_id=friend.id, friend_id=current_user.id))
    db.commit()
    return friend

@router.get("/{friend_id}/entries", response_model=list[MoodEntryOut])
def get_friend_entries(friend_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Проверяем, есть ли этот пользователь в друзьях
    friendship = db.query(Friendship).filter(
        Friendship.user_id == current_user.id,
        Friendship.friend_id == friend_id
    ).first()
    
    if not friendship:
        raise HTTPException(status_code=403, detail="Вы не друзья")
    
    entries = db.query(MoodEntry).filter(MoodEntry.owner_id == friend_id).order_by(MoodEntry.date.desc()).all()
    return entries