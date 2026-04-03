# Use offical Python image(what this means idk)
FROM python:3.12-slim

# set working directory inside container
WORKDIR /app

# Copy requirements from the api folder and install
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire repo into the container
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the app from the api directory
CMD ["python", "-m", "api.app"]
