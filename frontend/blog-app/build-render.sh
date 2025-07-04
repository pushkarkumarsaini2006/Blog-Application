#!/bin/bash

# Render Frontend Build Script
echo "=== Blog Frontend Build for Render ==="

# Set production environment
export NODE_ENV=production
export VITE_BACKEND_URL=https://blog-application-hgra.onrender.com

echo "Backend URL: $VITE_BACKEND_URL"

# Clear any existing builds
if [ -d "dist" ]; then
    echo "Removing existing dist folder..."
    rm -rf dist
fi

# Clear node_modules if it exists (optional - for clean builds)
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Verify build completed
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "Contents of dist folder:"
    ls -la dist/
else
    echo "❌ Build failed - dist folder not created"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build for production
echo "Building for production..."
npm run build

# Verify build
if [ -d "dist" ]; then
    echo "✅ Build successful! Files ready for deployment:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "=== Build Complete ==="
