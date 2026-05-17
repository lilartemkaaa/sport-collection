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
