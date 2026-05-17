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
│   │   └── services/     # бизнес-логика (JWT, bcrypt)
│   ├── tests/            # pytest + Hypothesis (100% coverage)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # Login, Home, Quiz, Collection, Admin
│   │   ├── components/   # Navbar, CardDisplay
│   │   └── api/          # axios-клиент и типы
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml    # запуск всего проекта одной командой
```

## Быстрый старт через Docker (рекомендуется)

```bash
docker compose up --build
```

После сборки (3–5 минут):
- **Фронтенд**: http://localhost
- **Бэкенд API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs

### Создать администратора

```bash
docker compose exec db psql -U cards_user -d cards_db \
  -c "UPDATE users SET role = 'admin' WHERE username = 'твой_логин';"
```

Перелогиниться — в навбаре появится ссылка «Админ».

---

## Запуск для разработки (без Docker)

### 1. База данных

```bash
docker compose up -d db
```

### 2. Бэкенд

```bash
cd backend
cp .env.example .env
source .venv/bin/activate        # или .venv\Scripts\activate на Windows
uvicorn app.main:app --reload
```

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтенд: http://localhost:5173

---

## Тесты

```bash
cd backend
source .venv/bin/activate
pytest --cov=app --cov-report=term-missing
```

Результат: **100% покрытие**, 37 тестов включая фаззинг через Hypothesis.

---

## Функциональность

| Страница | Что делает |
|---|---|
| `/login` | Регистрация и вход (JWT) |
| `/` | Баланс билетов, паки трёх лиг, открытие карточек |
| `/quiz` | Викторина с таймером 20с и начислением билетов |
| `/collection` | Грид выбитых карточек с разделением по лигам |
| `/admin` | CRUD карточек (только для роли admin) |

### Бизнес-логика паков

- **Common** — 60%, **Rare** — 30%, **Legendary** — 10%
- Стоимость: 10 билетов за пак
- Билеты зарабатываются за правильные ответы в викторине (быстрее 20 секунд)
