.PHONY: backend frontend openapi sqlite init-db migrate drop-db

backend:
	cd backend && poetry install && poetry run uvicorn main:app --host 0.0.0.0 --log-level info --reload

frontend:
	make openapi
	cd frontend && npm i && npm run dev

openapi:
	curl -f http://localhost:8000/openapi.json | jq .  | tee frontend/src/scheme/openapi.json | less

sqlite:
	cd backend && sqlite3 ./test.db

init-db:
	cd backend && poetry run alembic upgrade head

migrate:
	cd backend && poetry run alembic revision --autogenerate -m "$(shell date -u +%Y-%m-%d_%H:%M:%SZ)" && \
  poetry run alembic upgrade head

drop-db:
	cd backend && rm -f ./test.db
