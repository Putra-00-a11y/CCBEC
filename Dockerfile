FROM node:18

# Install build tools yang dibutuhin node-gyp
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libxss1 \
  libxshmfence1 \
  libgbm1 \
  libdrm2 \
  libxext6 \
  libxfixes3 \
  libgl1 \
  libglu1-mesa \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libjpeg-dev \
  libx11-dev \
  libxtst6 \
  xdg-utils \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set direktori kerja
WORKDIR /app

# Copy semua isi project ke container
COPY . .

# Install dependencies dari package-lock.json
RUN npm ci

# Start aplikasi
CMD ["npm", "start"]
