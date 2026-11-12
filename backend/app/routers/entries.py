from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import MoodEntry, User
from ..schemas import MoodEntryCreate, MoodEntryUpdate, MoodEntryOut
from ..auth import get_current_user

router = APIRouter(prefix="/entries", tags=["entries"])


@router.get("", response_model=list[MoodEntryOut])
def list_entries(
    mood: Optional[int] = Query(default=None, ge=1, le=5),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(MoodEntry).filter(MoodEntry.owner_id == current_user.id)
    if mood is not None:
        q = q.filter(MoodEntry.mood == mood)
    if date_from is not None:
        q = q.filter(MoodEntry.date >= date_from)
    if date_to is not None:
        q = q.filter(MoodEntry.date <= date_to)
    return q.order_by(MoodEntry.date.desc()).all()


@router.get("/{entry_id}", response_model=MoodEntryOut)
def get_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.get(MoodEntry, entry_id)
    if not entry or entry.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.post("", response_model=MoodEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    payload: MoodEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = MoodEntry(**payload.model_dump(), owner_id=current_user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=MoodEntryOut)
def update_entry(
    entry_id: int,
    payload: MoodEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.get(MoodEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if entry.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your entry")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.get(MoodEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if entry.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your entry")
    db.delete(entry)
    db.commit()