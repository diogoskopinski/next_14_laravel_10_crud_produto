<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Opção 1: Usando Factory (recomendado)
        Product::factory()->count(50)->create();

        // Opção 2: Dados manuais (se quiser produtos específicos)
        $this->createManualProducts();
    }

    private function createManualProducts(): void
    {
        $products = [
            [
                'name' => 'MacBook Pro M3',
                'description' => 'Laptop Apple com chip M3, 16GB RAM, 512GB SSD',
                'price' => 2499.99,
                'quantity' => 15,
                'category' => 'Eletrônicos',
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Smartphone Apple com câmera de 48MP',
                'price' => 1199.99,
                'quantity' => 30,
                'category' => 'Eletrônicos',
            ],
            [
                'name' => 'Clean Code',
                'description' => 'Livro sobre boas práticas de programação',
                'price' => 49.99,
                'quantity' => 50,
                'category' => 'Livros',
            ],
            [
                'name' => 'Camiseta Premium',
                'description' => 'Camiseta 100% algodão, várias cores',
                'price' => 29.99,
                'quantity' => 100,
                'category' => 'Roupas',
            ],
            [
                'name' => 'Ferramentas Profissionais',
                'description' => 'Kit com 50 peças para manutenção',
                'price' => 199.99,
                'quantity' => 25,
                'category' => 'Automotivo',
            ],
            [
                'name' => 'Café Especial',
                'description' => 'Grãos de café premium, torra média',
                'price' => 24.99,
                'quantity' => 80,
                'category' => 'Alimentos & Bebidas',
            ],
            [
                'name' => 'Notebook Executivo',
                'description' => 'Caderno de couro com 200 folhas',
                'price' => 39.99,
                'quantity' => 60,
                'category' => 'Materiais de Escritório',
            ],
            [
                'name' => 'Bola de Futebol',
                'description' => 'Bola oficial tamanho 5',
                'price' => 89.99,
                'quantity' => 40,
                'category' => 'Esportes',
            ],
            [
                'name' => 'Shampoo Revitalizante',
                'description' => 'Shampoo para cabelos danificados',
                'price' => 34.99,
                'quantity' => 75,
                'category' => 'Saúde e Beleza',
            ],
            [
                'name' => 'Lego Classic',
                'description' => 'Kit com 1500 peças para construção',
                'price' => 79.99,
                'quantity' => 35,
                'category' => 'Brinquedos',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
