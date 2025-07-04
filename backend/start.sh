#!/bin/bash

# Render deployment start script
echo "Starting Blog Backend on Render..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"

# Start the application
exec node server.js
