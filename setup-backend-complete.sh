#!/bin/bash
echo "🚀 CONFIGURAÇÃO COMPLETA DO BACKEND LARAVEL"
echo "============================================"

# 1. Parar serviços
echo "1. 🛑 Parando serviços..."
docker-compose down 2>/dev/null

# 2. Corrigir permissões
echo "2. 🔐 Corrigindo permissões..."
sudo chown -R $USER:$USER backend/
sudo chmod -R 755 backend/storage backend/bootstrap/cache

# 3. Criar Model Product
echo "3. 📦 Criando Model Product..."
cat > backend/app/Models/Product.php << 'MODEL'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected \$fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'category'
    ];

    protected \$casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer'
    ];
}
MODEL
echo "   ✅ Model Product criado"

# 4. Criar Controller Product
echo "4. 🎮 Criando ProductController..."
mkdir -p backend/app/Http/Controllers/Api

cat > backend/app/Http/Controllers/Api/ProductController.php << 'CONTROLLER'
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        \$products = Product::all();
        return response()->json([
            'success' => true,
            'data' => \$products
        ]);
    }

    public function store(Request \$request)
    {
        \$validator = Validator::make(\$request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'category' => 'required|string|max:100'
        ]);

        if (\$validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => \$validator->errors()
            ], 422);
        }

        \$product = Product::create(\$request->all());

        return response()->json([
            'success' => true,
            'data' => \$product,
            'message' => 'Product created successfully'
        ], 201);
    }

    public function show(\$id)
    {
        \$product = Product::find(\$id);
        
        if (!\$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => \$product
        ]);
    }

    public function update(Request \$request, \$id)
    {
        \$product = Product::find(\$id);

        if (!\$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        \$validator = Validator::make(\$request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'category' => 'sometimes|string|max:100'
        ]);

        if (\$validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => \$validator->errors()
            ], 422);
        }

        \$product->update(\$request->all());

        return response()->json([
            'success' => true,
            'data' => \$product,
            'message' => 'Product updated successfully'
        ]);
    }

    public function destroy(\$id)
    {
        \$product = Product::find(\$id);

        if (!\$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        \$product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function generateDescription(Request \$request)
    {
        \$validator = Validator::make(\$request->all(), [
            'product_name' => 'required|string',
            'category' => 'required|string'
        ]);

        if (\$validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => \$validator->errors()
            ], 422);
        }

        \$mockDescription = "This is an amazing {\$request->category} product called '{\$request->product_name}'. Perfect for modern needs!";
        
        return response()->json([
            'success' => true,
            'description' => \$mockDescription,
            'note' => 'Set OPENAI_API_KEY for real AI'
        ]);
    }
}
CONTROLLER
echo "   ✅ ProductController criado"

# 5. Criar HealthController
echo "5. 🩺 Criando HealthController..."
cat > backend/app/Http/Controllers/Api/HealthController.php << 'HEALTH'
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index()
    {
        try {
            DB::connection()->getPdo();
            \$dbStatus = 'connected';
        } catch (\Exception \$e) {
            \$dbStatus = 'disconnected';
        }

        return response()->json([
            'status' => 'healthy',
            'service' => 'Laravel API',
            'version' => app()->version(),
            'timestamp' => now()->toDateTimeString(),
            'database' => \$dbStatus,
            'endpoints' => [
                'products' => '/api/products',
                'health' => '/api/health'
            ]
        ]);
    }
}
HEALTH
echo "   ✅ HealthController criado"

# 6. Configurar rotas API
echo "6. 🛣️ Configurando rotas API..."
cat > backend/routes/api.php << 'ROUTES'
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProductController;

// Health check
Route::get('/health', [HealthController::class, 'index']);

// Products CRUD
Route::apiResource('products', ProductController::class);

// AI Integration
Route::post('/generate-description', [ProductController::class, 'generateDescription']);

// API info
Route::get('/', function () {
    return response()->json([
        'app' => config('app.name'),
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/health',
            'GET /api/products',
            'POST /api/products',
            'GET /api/products/{id}',
            'PUT /api/products/{id}',
            'DELETE /api/products/{id}',
            'POST /api/generate-description'
        ]
    ]);
});
ROUTES
echo "   ✅ Rotas API configuradas"

# 7. Iniciar serviços
echo "7. 🚀 Iniciando serviços Docker..."
docker-compose up -d

# 8. Aguardar inicialização
echo "8. ⏳ Aguardando serviços (20 segundos)..."
sleep 20

# 9. Criar migration se não existir
echo "9. 📊 Criando migration de produtos..."
docker-compose exec laravel bash -c "
if [ ! -f \"database/migrations/*create_products_table.php\" ]; then
    php artisan make:migration create_products_table --quiet
fi
"

# Encontrar e corrigir migration
MIGRATION_FILE=\$(find backend/database/migrations -name \"*create_products_table.php\" | head -1)
if [ ! -z \"\$MIGRATION_FILE\" ]; then
    sudo chown \$USER:\$USER "\$MIGRATION_FILE"
    
    cat > "\$MIGRATION_FILE" << 'MIGRATION'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->text('description');
            \$table->decimal('price', 10, 2);
            \$table->integer('quantity')->default(0);
            \$table->string('category');
            \$table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
MIGRATION
    echo "   ✅ Migration criada/corrigida"
fi

# 10. Executar migration
echo "10. 🗄️ Executando migration..."
docker-compose exec laravel php artisan migrate --force
echo "   ✅ Migration executada"

# 11. Criar dados de teste
echo "11. �� Criando dados de teste..."
docker-compose exec laravel bash -c "
php artisan tinker --execute='
    use App\\\\Models\\\\Product;
    
    \$products = [
        [\"name\" => \"MacBook Pro\", \"description\" => \"Laptop Apple\", \"price\" => 1999.99, \"quantity\" => 10, \"category\" => \"Electronics\"],
        [\"name\" => \"iPhone 15\", \"description\" => \"Smartphone Apple\", \"price\" => 999.99, \"quantity\" => 25, \"category\" => \"Electronics\"],
        [\"name\" => \"Clean Code Book\", \"description\" => \"Programming book\", \"price\" => 39.99, \"quantity\" => 50, \"category\" => \"Books\"],
    ];
    
    foreach (\$products as \$product) {
        Product::create(\$product);
    }
    
    echo \"✅ \" . count(\$products) . \" produtos criados\\n\";
'"

# 12. Testar API
echo ""
echo "12. 🧪 TESTANDO API:"
echo "    Health Check:"
curl -s http://localhost:8000/api/health | grep -o '"status":"[^"]*"' | head -1 | sed 's/"/ /g'
echo ""
echo "    Listar produtos:"
PRODUCT_COUNT=\$(curl -s http://localhost:8000/api/products | grep -o '"id"' | wc -l)
echo "    Total de produtos: \$PRODUCT_COUNT"
echo ""
echo "🎉 BACKEND LARAVEL CONFIGURADO COM SUCESSO!"
echo "🌐 Endpoints disponíveis:"
echo "   http://localhost:8000"
echo "   http://localhost:8000/api/health"
echo "   http://localhost:8000/api/products"
