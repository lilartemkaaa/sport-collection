import logging

from app.database import SessionLocal
from app.seed import seed_db


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
