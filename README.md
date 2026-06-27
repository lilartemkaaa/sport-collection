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
alembic upgrade head             # применить миграции (создать/обновить схему)
python -m app.seed_cli           # наполнить базу карточками и вопросами
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

## Миграции базы данных

Схемой управляет Alembic. Приложение больше не меняет схему на старте — это делается отдельным шагом (принцип build/release/run).

```bash
cd backend
source .venv/bin/activate

alembic upgrade head          # применить все миграции
alembic downgrade -1          # откатить последнюю миграцию
alembic history               # список миграций
alembic revision --autogenerate -m "описание"   # создать новую миграцию по моделям
```

URL базы берётся из переменной окружения `DATABASE_URL` (см. `.env.example`), в `alembic.ini` он не захардкожен.

В Docker миграции применяются автоматически: команда контейнера бэкенда — `alembic upgrade head && uvicorn ...`.

### Существующая база на проде

Если база уже создана старой версией приложения (через `create_all`) и в ней есть данные, нельзя запускать первую миграцию — таблицы уже существуют. Сначала пометь её состояние первой миграцией, затем накати остальные:

```bash
alembic stamp dc02abe3fb7d     # пометить, что начальная схема уже есть
alembic upgrade head           # накатить только новые поля
```

## Наполнение базы (seed)

Данные карточек и вопросов добавляются вручную, отдельной командой:

```bash
cd backend
source .venv/bin/activate
python -m app.seed_cli
```

Команда идемпотентна: повторный запуск не дублирует данные.

---

## Тесты

```bash
cd backend
source .venv/bin/activate
pytest --cov=app --cov-report=term-missing
```

Результат: **~100% покрытие**, 53 теста включая фаззинг через Hypothesis.

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
