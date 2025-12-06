import ProductList from '@/components/ProductList'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <p className="mt-2 text-gray-600">
          Gerencie seus produtos cadastrados no sistema
        </p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Lista de produtos cadastrados no banco de dados
        </div>
        <Link 
          href="/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Link>
      </div>
      
      <ProductList />
    </div>
  )
}
