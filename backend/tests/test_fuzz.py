from hypothesis import given, settings, HealthCheck
from hypothesis import strategies as st


@given(
    username=st.text(max_size=60),
    password=st.text(max_size=60),
)
@settings(max_examples=40, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_login_never_500(client, username, password):
    """Любые данные логина не должны вызывать 500."""
    r = client.post("/api/auth/login", json={"username": username, "password": password})
    assert r.status_code != 500, f"500 на username={username!r}"


@given(
    session_id=st.integers(min_value=-9999, max_value=99999),
    selected_option=st.integers(min_value=-100, max_value=100),
)
@settings(max_examples=40, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_quiz_submit_never_500(client, user_h, regular_user, session_id, selected_option):
    """Случайные session_id и ответы не должны вызывать 500."""
    r = client.post(
        "/api/quiz/submit",
        headers=user_h,
        json={"session_id": session_id, "selected_option": selected_option},
    )
    assert r.status_code != 500, f"500 на session_id={session_id}, option={selected_option}"


@given(
    league=st.sampled_from(["football", "nba", "nhl", "invalid", "", "   "]),
)
@settings(max_examples=20, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_pack_open_never_500(client, user_h, league):
    """Любая лига в запросе не должна вызывать 500."""
    r = client.post("/api/packs/open", headers=user_h, json={"league": league})
    assert r.status_code != 500


@given(
    username=st.text(max_size=60),
    password=st.text(max_size=60),
)
@settings(max_examples=40, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_register_never_500(client, username, password):
    """Любые данные регистрации не должны вызывать 500 — только 201/400/422."""
    r = client.post("/api/auth/register", json={"username": username, "password": password})
    assert r.status_code != 500, f"500 на username={username!r}"
    assert r.status_code in (201, 400, 422)


@given(
    correct_option=st.integers(min_value=-10, max_value=10),
)
@settings(max_examples=30, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_create_question_correct_option_validated(client, admin_h, correct_option):
    """correct_option вне диапазона 1..4 должен отклоняться валидацией (422), а не падать 500."""
    r = client.post(
        "/api/admin/questions",
        headers=admin_h,
        json={
            "question": "Q?",
            "option_1": "A",
            "option_2": "B",
            "option_3": "C",
            "option_4": "D",
            "correct_option": correct_option,
        },
    )
    assert r.status_code != 500
    if 1 <= correct_option <= 4:
        assert r.status_code == 201
    else:
        assert r.status_code == 422


@given(
    start_balance=st.integers(min_value=10, max_value=1000),
)
@settings(max_examples=15, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_fuzz_pack_open_decrements_balance_by_cost(client, user_h, regular_user, db, start_balance):
    """Property: при успешном открытии пака баланс уменьшается ровно на стоимость пака (10)."""
    regular_user.tickets_balance = start_balance
    db.commit()
    r = client.post("/api/packs/open", headers=user_h, json={"league": "football"})
    if r.status_code == 200:
        db.refresh(regular_user)
        assert regular_user.tickets_balance == start_balance - 10
    else:
        # единственная штатная альтернатива при достаточном балансе —
        # все карточки лиги уже собраны
        assert r.status_code == 400
