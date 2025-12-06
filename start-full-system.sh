#!/bin/bash
echo "🚀 INICIANDO SISTEMA COMPLETO CRUD"
echo "==================================="

# 1. Parar serviços anteriores
echo "🛑 Parando serviços anteriores..."
docker-compose down 2>/dev/null

# 2. Remover volumes antigos se necessário
if [ "$1" == "--clean" ]; then
    echo "🧹 Limpando volumes..."
    docker-compose down -v 2>/dev/null
fi

# 3. Construir containers
echo "🔨 Construindo containers..."
docker-compose build --no-cache

# 4. Iniciar serviços
echo "🚀 Iniciando todos os serviços..."
docker-compose up -d

# 5. Aguardar inicialização
echo "⏳ Aguardando inicialização (40 segundos)..."
sleep 40

# 6. Executar migrations do Laravel
echo "📦 Configurando banco de dados..."
docker-compose exec backend php artisan migrate --force 2>/dev/null || echo "⚠️  Migrations podem ter falhado ou já executadas"

# 7. Criar dados de teste
echo "🧪 Criando dados de teste..."
docker-compose exec backend php artisan tinker --execute='
use App\Models\Product;

$products = [
    ["name" => "MacBook Pro 16\"", "description" => "Apple MacBook Pro M3 Max", "price" => 3499.99, "quantity" => 25, "category" => "Electronics"],
    ["name" => "iPhone 15 Pro", "description" => "Smartphone Apple", "price" => 1199.99, "quantity" => 50, "category" => "Electronics"],
    ["name" => "Clean Code Book", "description" => "Programming best practices", "price" => 39.99, "quantity" => 200, "category" => "Books"],
];

$created = 0;
foreach ($products as $product) {
    try {
        Product::create($product);
        $created++;
    } catch (\Exception $e) {
        echo "Erro: " . $e->getMessage() . "\n";
    }
}

echo "✅ " . $created . " produtos criados\n";
'

# 8. Verificar status
echo ""
echo "📊 STATUS DOS SERVIÇOS:"
docker-compose ps

echo ""
echo "🌐 SERVIÇOS DISPONÍVEIS:"
echo "   Frontend Next.js:  http://localhost:3000"
echo "   Backend Laravel:   http://localhost:8000"
echo "   PHPMyAdmin:        http://localhost:8080"
echo "   MySQL:             localhost:3306"
echo ""
echo "🔧 ENDPOINTS DA API:"
echo "   Health Check:      http://localhost:8000/api/health"
echo "   Produtos:          http://localhost:8000/api/products"
echo ""
echo "📋 COMANDOS ÚTEIS:"
echo "   docker-compose logs -f          # Ver logs"
echo "   docker-compose exec backend bash # Acessar Laravel"
echo "   docker-compose exec frontend sh  # Acessar Next.js"
echo "   docker-compose down             # Parar serviços"
echo ""
echo "🎉 Sistema completo iniciado com sucesso!"
