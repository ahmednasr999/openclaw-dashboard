#!/bin/bash
# Start ChromaDB server via Docker

cd "$(dirname "$0")"

if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing ChromaDB via pip fallback..."
    exit 1
fi

docker-compose up -d chromadb
echo "ChromaDB starting on http://localhost:8000"
