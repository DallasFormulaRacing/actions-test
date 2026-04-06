FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements and install dependencies first (layer caching)
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the API source code
COPY api/ ./api/

# Expose the Flask port
EXPOSE 5000

# Run with gunicorn for production (more robust than flask dev server)
CMD ["python", "-m", "gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "api:app"]
