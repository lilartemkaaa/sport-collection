from sqlalchemy.orm import Session
from app.models.card import Card, League, Rarity
from app.models.quiz_question import QuizQuestion

CARDS = [
    # football — 5 карточек
    {"name": "Lionel Messi", "league": League.football, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg"},
    {"name": "Cristiano Ronaldo", "league": League.football, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg"},
    {"name": "Kylian Mbappé", "league": League.football, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank–077_%28cropped%29.jpg"},
    {"name": "Erling Haaland", "league": League.football, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/thirty/Erling_Haaland.jpg"},
    {"name": "Pedri", "league": League.football, "rarity": Rarity.common,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Pedri_-_FC_Barcelona_2020-21.jpg"},

    # nba — 5 карточек
    {"name": "LeBron James", "league": League.nba, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/c/cf/LeBron_James_crop.jpg"},
    {"name": "Stephen Curry", "league": League.nba, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Stephen_Curry_2019.jpg"},
    {"name": "Giannis Antetokounmpo", "league": League.nba, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Giannis_Antetokounmpo_2016.jpg"},
    {"name": "Luka Dončić", "league": League.nba, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Luka_Don%C4%8Di%C4%87_2019.jpg"},
    {"name": "Jayson Tatum", "league": League.nba, "rarity": Rarity.common,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/70/Jayson_Tatum_2017.jpg"},

    # nhl — 5 карточек
    {"name": "Connor McDavid", "league": League.nhl, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Connor_McDavid_2019.jpg"},
    {"name": "Alex Ovechkin", "league": League.nhl, "rarity": Rarity.legendary,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Alexander_Ovechkin_2009.jpg"},
    {"name": "Nathan MacKinnon", "league": League.nhl, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Nathan_MacKinnon_2017.jpg"},
    {"name": "Sidney Crosby", "league": League.nhl, "rarity": Rarity.rare,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/52/Sidney_Crosby_2017.jpg"},
    {"name": "Auston Matthews", "league": League.nhl, "rarity": Rarity.common,
     "image_url": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Auston_Matthews_2018.jpg"},
]

QUESTIONS = [
    {
        "question": "В каком году Лионель Месси выиграл свой первый Золотой мяч?",
        "option_1": "2007", "option_2": "2009", "option_3": "2010", "option_4": "2012",
        "correct_option": 2,
    },
    {
        "question": "Сколько голов забил Криштиану Роналду в карьере в сборной Португалии (по данным 2024 г.)?",
        "option_1": "Более 100", "option_2": "Более 120", "option_3": "Более 90", "option_4": "Более 80",
        "correct_option": 1,
    },
    {
        "question": "Кто является рекордсменом по голам в истории НХЛ?",
        "option_1": "Уэйн Гретцки", "option_2": "Александр Овечкин", "option_3": "Марио Лемье", "option_4": "Яромир Ягр",
        "correct_option": 2,
    },
    {
        "question": "Из какой страны родом баскетболист Лука Дончич?",
        "option_1": "Хорватия", "option_2": "Сербия", "option_3": "Словения", "option_4": "Босния",
        "correct_option": 3,
    },
    {
        "question": "Сколько раз ЛеБрон Джеймс выигрывал чемпионат НБА?",
        "option_1": "2", "option_2": "3", "option_3": "4", "option_4": "5",
        "correct_option": 3,
    },
    {
        "question": "Коннор МакДэвид играет в НХЛ за команду:",
        "option_1": "Toronto Maple Leafs", "option_2": "Calgary Flames",
        "option_3": "Edmonton Oilers", "option_4": "Vancouver Canucks",
        "correct_option": 3,
    },
    {
        "question": "В каком клубе Килиан Мбаппе провёл большую часть карьеры до 2024 года?",
        "option_1": "Монако", "option_2": "ПСЖ", "option_3": "Реал Мадрид", "option_4": "Манчестер Сити",
        "correct_option": 2,
    },
    {
        "question": "Стефен Карри известен как лучший в истории НБА по:",
        "option_1": "Блок-шотам", "option_2": "Передачам", "option_3": "Трёхочковым броскам", "option_4": "Подборам",
        "correct_option": 3,
    },
    {
        "question": "За какой клуб НХЛ выступает Натан Маккиннон?",
        "option_1": "Colorado Avalanche", "option_2": "Pittsburgh Penguins",
        "option_3": "Tampa Bay Lightning", "option_4": "Dallas Stars",
        "correct_option": 1,
    },
    {
        "question": "Эрлинг Холанд является гражданином:",
        "option_1": "Дании", "option_2": "Швеции", "option_3": "Норвегии", "option_4": "Финляндии",
        "correct_option": 3,
    },

    # === Футбол ===
    {
        "question": "В каком году Аргентина выиграла чемпионат мира в Катаре?",
        "option_1": "2018", "option_2": "2022", "option_3": "2026", "option_4": "2014",
        "correct_option": 2,
    },
    {
        "question": "Кто является рекордсменом по голам в истории Лиги чемпионов УЕФА?",
        "option_1": "Лионель Месси", "option_2": "Роберт Левандовски",
        "option_3": "Криштиану Роналду", "option_4": "Рауль",
        "correct_option": 3,
    },
    {
        "question": "Какая страна выиграла Евро-2020 (проходил в 2021 году)?",
        "option_1": "Франция", "option_2": "Испания", "option_3": "Англия", "option_4": "Италия",
        "correct_option": 4,
    },
    {
        "question": "В каком клубе Зинедин Зидан провёл лучшие годы карьеры?",
        "option_1": "Реал Мадрид", "option_2": "Ювентус", "option_3": "ПСЖ", "option_4": "Марсель",
        "correct_option": 1,
    },
    {
        "question": "Кто выиграл Золотой мяч в 2023 году?",
        "option_1": "Килиан Мбаппе", "option_2": "Эрлинг Холанд",
        "option_3": "Лионель Месси", "option_4": "Криштиану Роналду",
        "correct_option": 3,
    },
    {
        "question": "В каком городе находится стадион Камп Ноу?",
        "option_1": "Мадрид", "option_2": "Барселона", "option_3": "Валенсия", "option_4": "Бильбао",
        "correct_option": 2,
    },
    {
        "question": "Педри выступает за клуб:",
        "option_1": "Реал Мадрид", "option_2": "Атлетико Мадрид",
        "option_3": "Барселона", "option_4": "Севилья",
        "correct_option": 3,
    },
    {
        "question": "В какой клуб перешёл Килиан Мбаппе летом 2024 года?",
        "option_1": "Манчестер Сити", "option_2": "Бавария",
        "option_3": "Реал Мадрид", "option_4": "Арсенал",
        "correct_option": 3,
    },
    {
        "question": "Кто забил знаменитый «Гол века» на чемпионате мира 1986 года?",
        "option_1": "Пеле", "option_2": "Роналдо", "option_3": "Зидан", "option_4": "Марадона",
        "correct_option": 4,
    },
    {
        "question": "В каком году Германия выиграла чемпионат мира в Бразилии?",
        "option_1": "2010", "option_2": "2014", "option_3": "2018", "option_4": "2006",
        "correct_option": 2,
    },
    {
        "question": "В каком португальском клубе начинал карьеру Криштиану Роналду?",
        "option_1": "Бенфика", "option_2": "Порту", "option_3": "Спортинг", "option_4": "Брага",
        "correct_option": 3,
    },
    {
        "question": "Нападающим какого клуба является Эрлинг Холанд?",
        "option_1": "Ливерпуль", "option_2": "Манчестер Юнайтед",
        "option_3": "Манчестер Сити", "option_4": "Челси",
        "correct_option": 3,
    },
    {
        "question": "За какую национальную сборную выступает Педри?",
        "option_1": "Португалия", "option_2": "Испания", "option_3": "Аргентина", "option_4": "Бразилия",
        "correct_option": 2,
    },
    {
        "question": "Кто является рекордсменом по голам на чемпионатах мира за всю историю?",
        "option_1": "Мирослав Клозе", "option_2": "Роналдо", "option_3": "Гарринча", "option_4": "Пеле",
        "correct_option": 1,
    },
    {
        "question": "Какая сборная выиграла чемпионат мира больше всего раз в истории?",
        "option_1": "Германия", "option_2": "Италия", "option_3": "Аргентина", "option_4": "Бразилия",
        "correct_option": 4,
    },
    {
        "question": "В каком году Испания выиграла свой первый чемпионат мира по футболу?",
        "option_1": "2006", "option_2": "2010", "option_3": "2014", "option_4": "2002",
        "correct_option": 2,
    },
    {
        "question": "Как называется клуб из Манчестера, выступающий в красной форме?",
        "option_1": "Арсенал", "option_2": "Ливерпуль",
        "option_3": "Манчестер Юнайтед", "option_4": "Манчестер Сити",
        "correct_option": 3,
    },
]


def seed_db(db: Session) -> None:
    if db.query(Card).count() == 0:
        db.add_all([Card(**c) for c in CARDS])
        db.commit()

    if db.query(QuizQuestion).count() == 0:
        db.add_all([QuizQuestion(**q) for q in QUESTIONS])
        db.commit()
