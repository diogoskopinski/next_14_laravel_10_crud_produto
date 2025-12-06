#!/bin/bash
echo "🚀 Iniciando CRUD System..."

# Parar tudo
docker-compose down 2>/dev/null

# Remover container orphaned
docker rm -f nextjs-frontend 2>/dev/null || true

# Construir
echo "Construindo containers..."
docker-compose build --no-cache

# Iniciar
echo "Iniciando serviços..."
docker-compose up -d

# Aguardar
echo "Aguardando inicialização..."
sleep 15

# Verificar
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "🧪 Testando API..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Backend funcionando!"
    echo "   Health: http://localhost:8000/api/health"
    echo "   Produtos: http://localhost:8000/api/products"
else
    echo "❌ Backend com problemas. Verificando logs..."
    docker-compose logs backend --tail=20
fi
