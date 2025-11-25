FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
