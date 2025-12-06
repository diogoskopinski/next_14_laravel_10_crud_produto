#!/bin/bash
# Script para iniciar Laravel 10

echo "🚀 Iniciando Laravel 10 com Docker..."
echo "===================================="

# 1. Parar serviços anteriores
echo "🛑 Parando serviços anteriores..."
docker-compose down 2>/dev/null

# 2. Construir containers
echo "🔨 Construindo containers..."
docker-compose build --no-cache

# 3. Iniciar serviços
echo "🚀 Iniciando MySQL e Laravel..."
docker-compose up -d

# 4. Aguardar inicialização
echo "⏳ Aguardando serviços (30 segundos)..."
sleep 30

# 5. Executar migrations
echo "📦 Executando migrations..."
docker-compose exec laravel php artisan migrate --force 2>/dev/null || echo "⚠️  Migrations falharam ou já executadas"

# 6. Verificar status
echo ""
echo "📊 STATUS DOS SERVIÇOS:"
docker-compose ps

# 7. Testar
echo ""
echo "🧪 TESTANDO LARAVEL:"
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Laravel está rodando!"
    echo "   URL: http://localhost:8000"
    echo ""
    echo "🔧 ENDPOINTS DISPONÍVEIS:"
    echo "   • http://localhost:8000/api/health"
    echo "   • http://localhost:8000/api/products"
else
    echo "❌ Laravel não está respondendo"
    echo ""
    echo "📋 VERIFICANDO LOGS..."
    docker-compose logs laravel --tail=20
fi

echo ""
echo "🎉 Configuração do Laravel 10 concluída!"
