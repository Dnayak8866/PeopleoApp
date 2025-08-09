# Use Node v22
FROM node:22

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose app port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]
