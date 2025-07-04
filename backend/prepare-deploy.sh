#!/bin/bash

# Blog Application Backend Deployment Preparation Script
echo "=== Blog Backend Deployment Preparation ==="

# Remove package-lock.json to ensure clean install
if [ -f "package-lock.json" ]; then
    echo "Removing existing package-lock.json..."
    rm package-lock.json
fi

# Remove node_modules to ensure clean install
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

echo "=== Preparation Complete ==="
echo "Your backend is ready for deployment!"
