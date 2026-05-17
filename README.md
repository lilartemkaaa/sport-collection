# Приложение для коллекционирования спортивных карточек

Курсовая работа. Позволяет управлять коллекцией спортивных карточек и проходить викторины по ним.

## Стек

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy + Alembic
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Тесты**: pytest (100% покрытие) + Hypothesis (фаззинг)

## Структура проекта

```
sports-cards-project/
├── backend/
│   ├── app/
│   │   ├── api/          # роуты FastAPI
│   │   ├── models/       # SQLAlchemy модели
│   │   ├── schemas/      # Pydantic схемы
│   │   └── services/     # бизнес-логика
│   ├── tests/            # pytest + Hypothesis
│   ├── alembic/          # миграции БД
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # страницы (react-router-dom)
│   │   ├── components/   # UI компоненты
│   │   └── api/          # запросы к бэкенду
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml    # запуск PostgreSQL
```

## Быстрый старт

```bash
# Поднять базу данных
docker compose up -d db

# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Функциональность

- Просмотр и управление коллекцией карточек (CRUD)
- Викторина: случайные вопросы по карточкам из коллекции
- Статистика ответов
