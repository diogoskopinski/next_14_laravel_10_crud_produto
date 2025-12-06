#!/bin/bash
echo "🔄 RESETANDO E CONFIGURANDO MYSQL DO ZERO"
echo "========================================="

# 1. Parar e remover tudo
echo "1. 🛑 Parando todos os serviços..."
docker-compose down --remove-orphans --volumes --timeout 0

# 2. Remover volume do MySQL
echo "2. 🗑️ Removendo volume do MySQL..."
docker volume rm next_laravel_mysql_data 2>/dev/null || true

# 3. Limpar sistema Docker
echo "3. 🧹 Limpando sistema Docker..."
docker system prune -af 2>/dev/null || true
docker volume prune -f 2>/dev/null || true

# 4. Construir e iniciar MySQL primeiro
echo "4. 🐳 Iniciando MySQL..."
docker-compose up -d mysql

# 5. Aguardar MySQL inicializar completamente
echo "5. ⏳ Aguardando MySQL (60 segundos)..."
sleep 60

# 6. Verificar MySQL
echo "6. 🔍 Verificando MySQL..."
if docker-compose exec mysql mysqladmin ping -hlocalhost -uroot -prootpassword > /dev/null 2>&1; then
    echo "   ✅ MySQL está rodando"
else
    echo "   ❌ MySQL não está respondendo"
    docker-compose logs mysql --tail=20
    exit 1
fi

# 7. Verificar se usuário foi criado
echo "7. 👤 Verificando usuários..."
docker-compose exec mysql mysql -uroot -prootpassword -e "
SHOW DATABASES;
SELECT user, host FROM mysql.user;
SELECT 'Usuários criados:' as message;
"

# 8. Testar conexão com usuário 'user'
echo "8. 🔌 Testando conexão com usuário 'user'..."
docker-compose exec mysql mysql -uuser -ppassword -e "SELECT '✅ Conectado como user' as status;" && \
echo "   ✅ Usuário 'user' funciona!" || echo "   ❌ Usuário 'user' não funciona"

# 9. Iniciar backend
echo "9. 🚀 Iniciando Laravel..."
docker-compose up -d backend

# 10. Aguardar Laravel
echo "10. ⏳ Aguardando Laravel (30 segundos)..."
sleep 30

# 11. Testar API
echo "11. 🧪 Testando API Laravel..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "   ✅ Laravel API está respondendo"
else
    echo "   ❌ Laravel API não está respondendo"
    docker-compose logs backend --tail=20
fi

# 12. Iniciar frontend
echo "12. 🎨 Iniciando Next.js..."
docker-compose up -d frontend

# 13. Aguardar frontend
sleep 15

# 14. Verificar status final
echo ""
echo "📊 STATUS FINAL:"
docker-compose ps

echo ""
echo "🌐 SERVIÇOS:"
echo "   MySQL:        localhost:3306 (root/rootpassword, user/password)"
echo "   PHPMyAdmin:   http://localhost:8080"
echo "   Laravel API:  http://localhost:8000"
echo "   Next.js:      http://localhost:3000"
echo ""
echo "🎉 Reset completo! O MySQL foi reconfigurado."
