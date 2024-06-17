# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN npm install

# Make port 7007 available to the world outside this container
EXPOSE 7007

# Run the app
CMD ["node", "ui.js"]

