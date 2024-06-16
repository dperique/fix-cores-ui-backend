# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install Flask

# Make port 7007 available to the world outside this container
EXPOSE 7007

# Run app.py when the container launches
CMD ["python", "backend.py"]

