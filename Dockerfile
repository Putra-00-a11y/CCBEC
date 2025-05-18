FROM node:18

# Install build tools yang dibutuhin node-gyp
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set direktori kerja
WORKDIR /app

# Copy semua isi project ke container
COPY . .

# Install dependencies dari package-lock.json
RUN npm ci

# Start aplikasi
CMD ["npm", "start"]
