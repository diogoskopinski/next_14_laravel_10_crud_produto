#!/bin/bash
echo "🚀 Iniciando deploy..."

# Atualiza código
git pull origin docker-production

# Build e restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Limpeza
docker system prune -f

echo "✅ Deploy concluído!"
docker compose ps