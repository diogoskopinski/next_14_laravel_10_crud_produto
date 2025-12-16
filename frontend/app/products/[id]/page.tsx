'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, API_URL } from '@/lib/api'

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock data para desenvolvimento
      const mockProducts: Product[] = [
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
        }
      ]

      // Tenta buscar da API
      try {
        const response = await api.products.getOne(Number(productId))
        const raw = response.data ?? {}

        if (!raw.id){
          throw new Error('Produto inválido')
        }

        setProduct({
          id: Number(raw.id),
          name: String(raw.name),
          description: String(raw.description),
          price: Number(raw.price),
          quantity: Number(raw.quantity),
          category: raw.category ?? 'Sem categoria',
          created_at: raw.created_at,
          updated_at: raw.updated_at,
        })

        console.log('API raw product:', raw)
        setProduct(raw)

      } catch (apiError) {
        // Usa mock data
        const mockProduct = mockProducts.find(p => p.id.toString() === productId) || mockProducts[0]
        setProduct(mockProduct)
        setError(`Não foi possível conectar à API. Mostrando dados de exemplo.`)
      }

    } catch (err) {
      console.error('Erro ao buscar produto:', err)
      setError('Erro ao carregar dados do produto')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setDeleting(true)

      await api.products.delete(Number(productId))
      alert('Produto excluído com sucesso!')
      router.push('/products')

    } catch (err) {
      console.error('Erro ao excluir produto:', err)
      alert('Erro ao excluir produto. Usando simulação de exclusão.')
      // Simula exclusão redirecionando
      setTimeout(() => {
        router.push('/products')
      }, 1000)
    } finally {
      setDeleting(false)
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produto #{productId}...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto Não Encontrado</h2>
          <p className="text-gray-600 mb-6">
            O produto #{productId} não foi encontrado no sistema.
          </p>
          <Link 
            href="/products" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Voltar para a lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/products" 
                className="text-gray-500 hover:text-gray-700"
              >
                ← Produtos
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes do Produto</h1>
            </div>
            <p className="mt-2 text-gray-600">
              Informações completas do produto #{product.id}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/products/${productId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Excluindo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Atenção</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações principais */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.quantity > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.quantity > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.quantity} unidades em estoque
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(product.price)}</div>
                  <div className="text-sm text-gray-500 mt-1">Preço de venda</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Metadados */}
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoria</label>
                  <p className="mt-1">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID do Produto</label>
                  <p className="mt-1 font-mono text-gray-900">#{product.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cadastrado em</label>
                  <p className="mt-1 text-gray-900">{formatDate(product.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Última atualização</label>
                  <p className="mt-1 text-gray-900">{formatDate(product.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Ações rápidas */}
        <div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  href={`/products/${productId}/edit`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Produto
                </Link>
                
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deleting ? 'Excluindo...' : 'Excluir Produto'}
                </button>

                <Link
                  href="/products/new"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Produto
                </Link>
              </div>
            </div>
          </div>

          {/* Status da API */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Status da API</h4>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${
                error ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {error ? 'Usando dados locais' : 'Conectado à API'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Endpoint: /api/products/{productId}
            </p>
          </div>
        </div>
      </div>

      {/* Voltar para lista */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a lista de produtos
        </Link>
      </div>
    </div>
  )
}
