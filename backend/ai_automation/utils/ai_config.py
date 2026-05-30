import os

def get_ai_mode():
    return os.getenv("AI_MODE", "live").lower()


def is_mock_mode():
    return get_ai_mode() == "mock"


def is_live_mode():
    return get_ai_mode() == "live"