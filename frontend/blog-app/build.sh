#!/bin/bash

# Build script for Render deployment
echo "Building frontend for production..."

# Set environment variables
export VITE_BACKEND_URL=https://blog-application-54yd.onrender.com

# Install dependencies
npm install

# Build the application
npm run build

echo "Build completed successfully!"
