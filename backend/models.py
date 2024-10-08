from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Practice(Base):
    __tablename__ = "practices"

    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String)
    toefl_score = Column(String)
    num_questions = Column(Integer)
    duration = Column(Integer)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    practice_id = Column(Integer)
    content = Column(String)


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer)
    content = Column(String)
    feedback = Column(String)
    score = Column(Float)
