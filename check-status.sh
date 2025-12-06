#!/bin/bash
echo "🔍 Verificando status dos serviços..."
echo ""

# 1. Verificar containers
echo "🐳 Containers:"
docker-compose ps
echo ""

# 2. Verificar Laravel
echo "🔄 Testando Laravel:"
if curl -s -f http://localhost:8000 > /dev/null; then
    echo "✅ Laravel: ONLINE"
    echo "   URL: http://localhost:8000"
else
    echo "❌ Laravel: OFFLINE"
fi
echo ""

# 3. Testar API
echo "🔌 Testando API Health:"
curl -s http://localhost:8000/api/health 2>/dev/null && echo "✅ API Health: OK" || echo "❌ API Health: FAILED"
echo ""

# 4. Verificar MySQL
echo "🗄️  Verificando MySQL:"
docker-compose exec mysql mysqladmin ping -hlocalhost -ularavel -ppassword 2>/dev/null && echo "✅ MySQL: ONLINE" || echo "❌ MySQL: OFFLINE"
echo ""

# 5. Verificar logs recentes
echo "📋 Últimos logs do Laravel:"
docker-compose logs laravel --tail=5 2>/dev/null | grep -v "^\s*$" || echo "   Sem logs recentes"
