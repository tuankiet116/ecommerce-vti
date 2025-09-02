#!/bin/bash

set -e

echo "📦 Checking and setting up PHP, Node.js, and pnpm environment..."

# ================================
# ⚙️ PHP 8.4 Setup
# ================================
PHP_REQUIRED_VERSION="8.4"

if php -v 2>/dev/null | grep -q "PHP $PHP_REQUIRED_VERSION"; then
  echo "✅ PHP $PHP_REQUIRED_VERSION is already installed"
else
  echo "⛔ PHP $PHP_REQUIRED_VERSION not found. Installing..."
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt-get update
  sudo apt-get install -y php${PHP_REQUIRED_VERSION} php${PHP_REQUIRED_VERSION}-{cli,mbstring,xml,curl,mysql,fpm,zip}
  sudo update-alternatives --install /usr/bin/php php /usr/bin/php${PHP_REQUIRED_VERSION} 100
  sudo update-alternatives --set php /usr/bin/php${PHP_REQUIRED_VERSION}
fi

# ================================
# ⚙️ Node.js v22.16.0 Setup via NVM
# ================================
NODE_REQUIRED_VERSION="v22.16.0"
NVM_DIR="$HOME/.nvm"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "📥 Installing NVM"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

if nvm ls "$NODE_REQUIRED_VERSION" | grep -q "$NODE_REQUIRED_VERSION"; then
  echo "✅ Node.js $NODE_REQUIRED_VERSION is already installed"
else
  echo "📥 Installing Node.js $NODE_REQUIRED_VERSION"
  nvm install "$NODE_REQUIRED_VERSION"
fi

echo "🔁 Switching to Node.js $NODE_REQUIRED_VERSION"
nvm use "$NODE_REQUIRED_VERSION"
nvm alias default "$NODE_REQUIRED_VERSION"

# Add Node to PATH for current session
export PATH="$NVM_DIR/versions/node/$NODE_REQUIRED_VERSION/bin:$PATH"

# ================================
# ⚙️ pnpm Setup
# ================================
if ! command -v pnpm &> /dev/null; then
  echo "📥 Installing pnpm"
  npm install -g pnpm
else
  echo "✅ pnpm is already installed"
fi

# ================================
# ✅ Done
# ================================
echo ""
echo "✅ Environment is ready!"
php -v
node -v
pnpm -v
