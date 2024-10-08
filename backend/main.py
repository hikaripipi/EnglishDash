from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import openai
from openai import OpenAI
from database import get_db, init_db
from models import Practice, Question, Answer
from typing import List
import asyncio
import json

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.get("/api/db-test")
async def test_db_connection(db: AsyncSession = Depends(get_db)):
    try:
        # データベースに簡単なクエリを実行
        result = await db.execute(select(1))
        if result.scalar_one() == 1:
            return {"message": "データベース接続テスト成功"}
        else:
            return {"message": "データベース接続テスト失敗"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データベース接続エラー: {str(e)}")


import os

# OpenAI APIキーの設定
openai.api_key = os.environ.get("OPENAI_API_KEY")

# OpenAI クライアントの初期化
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


class PracticeSettings(BaseModel):
    mode: str
    toefl_score: str
    num_questions: int
    duration: int


class AnswerSubmit(BaseModel):
    answer: str


@app.get("/api/practice/start")
async def start_practice():
    return {"message": "Practice started"}


class PracticeSettingsResponse(BaseModel):
    message: str
    practice_id: int


@app.post("/api/practice/settings", response_model=PracticeSettingsResponse)
async def save_settings(settings: PracticeSettings, db: AsyncSession = Depends(get_db)):
    new_practice = Practice(**settings.dict())
    db.add(new_practice)
    await db.commit()
    await db.refresh(new_practice)

    # 質問を並列生成
    questions = await generate_questions_parallel(settings)

    # 生成した質問をデータベースに保存
    for question_content in questions:
        new_question = Question(practice_id=new_practice.id, content=question_content)
        db.add(new_question)

    await db.commit()

    return PracticeSettingsResponse(
        message="設定と質問が保存されました", practice_id=new_practice.id
    )


class PracticeSettingsResponse(BaseModel):
    message: str
    practice_id: int


async def generate_single_question(settings: PracticeSettings) -> str:
    prompt = f"""
    TOEFLスコア {settings.toefl_score} の学生向けの、
    {settings.mode} モードの質問を1つ生成してください。
    質問は {settings.duration} 分で回答できる程度の長さにしてください。
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "あなたはTOEFL試験の質問を生成する専門家です。",
            },
            {"role": "user", "content": prompt},
        ],
        functions=[
            {
                "name": "generate_question",
                "description": "TOEFL試験の質問を生成する",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string",
                            "description": "生成されたTOEFL試験の質問",
                        },
                    },
                    "required": ["question"],
                },
            }
        ],
        function_call={"name": "generate_question"},
    )

    function_call = response.choices[0].message.function_call
    question = json.loads(function_call.arguments)["question"]

    return question.strip()


async def generate_questions_parallel(settings: PracticeSettings) -> List[str]:
    tasks = [generate_single_question(settings) for _ in range(settings.num_questions)]
    return await asyncio.gather(*tasks)


class QuestionResponse(BaseModel):
    id: int
    content: str


@app.get("/api/practice/question/{practice_id}", response_model=List[QuestionResponse])
async def get_question(
    practice_id: int, db: AsyncSession = Depends(get_db)
) -> List[QuestionResponse]:
    result = await db.execute(
        select(Question).filter(Question.practice_id == practice_id)
    )
    questions = result.scalars().all()
    if not questions:
        raise HTTPException(status_code=404, detail="質問が見つかりません")
    return [QuestionResponse(id=q.id, content=q.content) for q in questions]


class AnswerResponse(BaseModel):
    score: int
    feedback: str


@app.post("/api/practice/answer/{question_id}", response_model=AnswerResponse)
async def submit_answer(
    question_id: int, answer: AnswerSubmit, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Question).filter(Question.id == question_id))
    question = result.scalar_one_or_none()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    evaluation = evaluate_answer(question.content, answer.answer)

    new_answer = Answer(
        question_id=question_id,
        content=answer.answer,
        score=evaluation["score"],
        feedback=evaluation["feedback"],
    )
    db.add(new_answer)
    await db.commit()

    return AnswerResponse(score=evaluation["score"], feedback=evaluation["feedback"])


def evaluate_answer(question: str, answer: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "英語の回答を評価し、0から100のスコアと詳細なフィードバックを提供してください。",
            },
            {"role": "user", "content": f"質問: {question}\n回答: {answer}"},
        ],
        functions=[
            {
                "name": "provide_evaluation",
                "description": "回答の評価結果を提供する",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "description": "0から100の範囲のスコア",
                        },
                        "feedback": {
                            "type": "string",
                            "description": "詳細なフィードバック",
                        },
                    },
                    "required": ["score", "feedback"],
                },
            }
        ],
        function_call={"name": "provide_evaluation"},
    )

    function_call = response.choices[0].message.function_call
    evaluation = json.loads(function_call.arguments)

    return evaluation


class PracticeResult(BaseModel):
    total_score: float
    individual_scores: List[int]
    feedback: str


@app.get("/api/practice/results/{practice_id}", response_model=PracticeResult)
async def get_results(practice_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Answer)
        .join(Question, Answer.question_id == Question.id)
        .filter(Question.practice_id == practice_id)
    )
    answers = result.scalars().all()

    if not answers:
        raise HTTPException(status_code=404, detail="練習結果が見つかりません")

    scores = [answer.score for answer in answers]
    answer_contents = [answer.content for answer in answers]
    feedbacks = [answer.feedback for answer in answers]

    overall_feedback = generate_feedback(scores, answer_contents, feedbacks)

    return PracticeResult(
        total_score=sum(scores) / len(scores),
        individual_scores=scores,
        feedback=overall_feedback,
    )


def generate_feedback(scores: list, answers: list, feedbacks: list) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "英語の練習結果に基づいて総合的なフィードバックを生成してください。",
            },
            {
                "role": "user",
                "content": f"スコア: {scores}\n回答: {answers}\n個別フィードバック: {feedbacks}",
            },
        ],
    )
    return response.choices[0].message.content


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
