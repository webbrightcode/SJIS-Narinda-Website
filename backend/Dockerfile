FROM python:3.12-slim

# Prevent Python from writing .pyc files to disc & buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . /app/

# Ensure entrypoint script is executable and static/media folders exist
RUN chmod +x /app/entrypoint.sh && \
    mkdir -p /app/staticfiles /app/media

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "-c", "gunicorn_conf.py", "sjis_backend.wsgi:application"]
