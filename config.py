import os
import dotenv

dotenv.load_dotenv()

def _get_int_env(name: str, default: int) -> int:
	value = os.getenv(name)
	if not value:
		return default
	try:
		return int(value)
	except ValueError:
		return default


ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")
REFRESH_INTERVAL_SECONDS = _get_int_env("REFRESH_INTERVAL_SECONDS", 1 * 60 * 60)
