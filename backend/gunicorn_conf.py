import multiprocessing
import os

bind = os.getenv("GUNICORN_BIND", "0.0.0.0:8000")
workers = int(os.getenv("GUNICORN_WORKERS", max(2, min(4, multiprocessing.cpu_count() * 2 + 1))))
threads = int(os.getenv("GUNICORN_THREADS", 2))
worker_class = "gthread"

timeout = int(os.getenv("GUNICORN_TIMEOUT", 120))
graceful_timeout = int(os.getenv("GUNICORN_GRACEFUL_TIMEOUT", 30))
keepalive = int(os.getenv("GUNICORN_KEEPALIVE", 5))

# Recycle workers periodically to prevent potential memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging to standard out/err for Docker and systemd journalctl
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
capture_output = True
