'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { CATEGORIES, Category } from '@/config/constants'
import { truncateText } from '@/utils/helpers';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: string
  created_at: string
  updated_at: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const getCategoryName = (categoryId: string) => {
    if (CATEGORIES.includes(categoryId as Category)){
      return categoryId;
    }

    return categoryId;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Tenta buscar da API Laravel
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors', // Importante para requisições entre diferentes origens
        credentials: 'omit'
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Produtos recebidos:', data)
      
      if (Array.isArray(data)) {
        setProducts(data)
        setUsingMockData(false)
      } else if (data.data && Array.isArray(data.data)) {
        // Se a API retornar {data: [...]}
        setProducts(data.data)
        setUsingMockData(false)
      } else {
        throw new Error('Formato de dados inválido')
      }
      
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
      setError(`Não foi possível carregar os produtos da API: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      setUsingMockData(true)
      
      /*
      // Dados mockados para demonstração
      setProducts([
        {
          id: 1,
          name: 'MacBook Pro',
          description: 'Laptop Apple M3',
          price: 1999.99,
          quantity: 10,
          category: 'Electronics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'iPhone 15',
          description: 'Smartphone Apple',
          price: 999.99,
          quantity: 25,
          category: 'Electronics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Clean Code',
          description: 'Programming book',
          price: 39.99,
          quantity: 50,
          category: 'Books',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Monitor 27"',
          description: 'Monitor 4K UHD',
          price: 599.99,
          quantity: 15,
          category: 'Electronics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Teclado Mecânico',
          description: 'Teclado RGB switches azuis',
          price: 129.99,
          quantity: 30,
          category: 'Peripherals',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      */
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Data inválida'
    }
  }

  const handleRetry = () => {
    fetchProducts()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      // Implementar exclusão quando a API estiver funcionando
      console.log('Excluir produto', id)
      // await fetch(`http://localhost:8000/api/products/${id}`, { method: 'DELETE' })
      // fetchProducts() // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
      alert('Erro ao excluir produto')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
          <p className="text-sm text-gray-400">Conectando à API: http://localhost:8000/api/products</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Atenção</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{error}</p>
                {usingMockData && (
                  <div className="mt-2">
                    <p className="font-medium">Mostrando dados de exemplo.</p>
                    <p className="text-xs mt-1">Para ver dados reais, certifique-se que:</p>
                    <ul className="text-xs list-disc list-inside mt-1">
                      <li>O backend Laravel está rodando (localhost:8000)</li>
                      <li>A API está acessível (curl http://localhost:8000/api/products)</li>
                      <li>O CORS está configurado no Laravel</li>
                    </ul>
                    <button
                      onClick={handleRetry}
                      className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {usingMockData && !error && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Mostrando dados de demonstração. O backend pode não estar acessível.
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qtde</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">#{product.id}</td>
            
            <td className="px-3 py-3 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                  {product.name.charAt(0)}
                </div>
                <div className="ml-2">
                  <div className="font-medium text-gray-900 text-xs">
                    {truncateText(product.name, 25)}
                  </div>
                </div>
              </div>
            </td>
            
            <td className="px-3 py-3">
              <div className="text-gray-500 text-xs max-w-[150px]">
                {truncateText(product.description, 50)}
              </div>
            </td>
            
            <td className="px-3 py-3 whitespace-nowrap font-semibold text-green-600 text-xs">
              {formatCurrency(product.price)}
            </td>
            
            <td className="px-3 py-3 whitespace-nowrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                product.quantity > 10 ? 'bg-green-100 text-green-800' : 
                product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {product.quantity}u
              </span>
            </td>
            
            <td className="px-3 py-3 whitespace-nowrap">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {product.category}
              </span>
            </td>
            
            <td className="px-3 py-3 whitespace-nowrap text-gray-500 text-xs">
              {formatDate(product.created_at)}
            </td>
            
            <td className="px-3 py-3 whitespace-nowrap">
              <div className="flex space-x-2">
                <Link 
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                  title="Ver detalhes"
                >
                  <EyeIcon className="w-4 h-4" />
                </Link>
                <Link 
                  href={`/products/${product.id}/edit`}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                  title="Editar"
                >
                  <PencilIcon className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded"
                  title="Excluir"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>
          Mostrando <span className="font-medium">{products.length}</span> produtos
          {usingMockData && <span className="ml-2 text-blue-600">(dados de demonstração)</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Status da API:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${!usingMockData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {!usingMockData ? '✅ Conectada' : '⚠️ Usando dados locais'}
          </span>
          <button 
            onClick={handleRetry}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}
