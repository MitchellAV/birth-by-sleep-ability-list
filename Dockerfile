# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to /app
COPY . .

EXPOSE 8080

RUN useradd -m app_user
USER app_user

# Specify the command to run the application
CMD ["marimo", "run", "app.py", "--host", "0.0.0.0", "--port", "8080"]