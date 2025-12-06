#!/bin/bash
# install.sh - Script de instalação automática

echo "========================================="
echo "  INSTALADOR DO SISTEMA CRUD COMPLETO"
echo "========================================="
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ ERRO: Docker não está instalado!"
    echo "👉 Instale o Docker primeiro: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERRO: Docker Compose não está instalado!"
    echo "👉 Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker e Docker Compose verificados"
echo ""

# Dar permissões
echo "🔧 Configurando permissões..."
chmod +x start.sh
chmod 755 backend/app backend/bootstrap/cache backend/storage
chmod 777 backend/storage/framework/backend/storage/framework/views

# Construir e iniciar containers
echo "🐳 Construindo containers Docker..."
docker-compose down
docker-compose build --no-cache

echo ""
echo "🚀 Iniciando serviços..."
docker-compose up -d

echo ""
echo "⏳ Aguardando inicialização dos serviços..."
sleep 15

echo ""
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "========================================="
echo ""
echo "🌐 ACESSO AOS SERVIÇOS:"
echo "   📱 Frontend:    http://localhost:3001"
echo "   🔧 Backend API: http://localhost:8000"
echo "   🗄️  PHPMyAdmin:  http://localhost:8081"
echo "   📊 MySQL:       localhost:3307"
echo ""
echo "🔧 CREDENCIAIS DO BANCO:"
echo "   Database: crud_db"
echo "   Usuário:  user"
echo "   Senha:    password"
echo ""
echo "🛠️  COMANDOS ÚTEIS:"
echo "   ./start.sh              # Iniciar/Parar sistema"
echo "   docker-compose logs -f  # Ver logs em tempo real"
echo "   docker-compose down     # Parar todos os serviços"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Aguarde 1-2 minutos para todos os serviços estarem 100%"
echo "   - Se tiver erro 502, aguarde mais um pouco e recarregue"
echo ""
echo "🎉 Sistema pronto para uso!"