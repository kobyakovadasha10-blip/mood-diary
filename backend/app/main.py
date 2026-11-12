from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import users, entries, friends

# ЭТА СТРОКА СОЗДАЕТ ТАБЛИЦЫ В БАЗЕ ДАННЫХ MOOD.DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mood Diary API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(users.router)
app.include_router(entries.router)
app.include_router(friends.router)

@app.get("/")
def root():
    return {"status": "ok"}