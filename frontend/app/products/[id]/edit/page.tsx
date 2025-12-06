'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/config/constants'

interface ProductFormData {
  name: string
  description: string
  price: string
  quantity: string
  category: string
}

interface Product extends ProductFormData {
  id: number
  created_at?: string
  updated_at?: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Buscar dados do produto
  useEffect(() => {
    fetchProduct()
  }, [productId])

           
  const fetchProduct = async () => {
    try {
      setFetching(true)
      setError(null)
      
      // Para desenvolvimento, use dados mockados se a API não responder
      const mockProducts: Product[] = [
        { 
          id: 1,
          name: 'MacBook Pro',
          description: 'Laptop Apple M3',
          price: '1999.99',
          quantity: '10',
          category: 'Electronics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'iPhone 15',
          description: 'Smartphone Apple',
          price: '999.99',
          quantity: '25',
          category: 'Electronics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Clean Code',
          description: 'Programming book',
          price: '39.99',
          quantity: '50',
          category: 'Books',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Primeiro tenta buscar da API
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const product = data.data || data

          console.log('l-96, produtos: ');
          console.log(data.data);
          
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            quantity: product.quantity?.toString() || '',
            category: product.category || ''
          })
        } else {

          // Se API falhar, usa mock data baseado no ID
          const mockProduct = mockProducts.find(p => p.id.toString() === productId) || mockProducts[0]
          setFormData({
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            quantity: mockProduct.quantity,
            category: mockProducts.category
          })
          setError(`API não respondeu. Mostrando dados de exemplo para produto ID: ${productId}`)
        }
      } catch (apiError) {
        // Se erro na API, usa mock data
        const mockProduct = mockProducts.find(p => p.id.toString() === productId) || mockProducts[0]
        setFormData({
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          quantity: mockProduct.quantity,
          category: mockProducts.category
        })
        setError(`Não foi possível conectar à API. Mostrando dados de exemplo.`)
      }
      
    } catch (err) {
      console.error('Erro ao buscar produto:', err)
      setError('Erro ao carregar dados do produto')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validação
      if (!formData.name.trim()) throw new Error('Nome é obrigatório')
      if (!formData.price || parseFloat(formData.price) <= 0) throw new Error('Preço deve ser maior que zero')
      if (!formData.quantity || parseInt(formData.quantity) < 0) throw new Error('Quantidade não pode ser negativa')

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category.trim() || 'Geral'
      }

      console.log(`Atualizando produto ${productId}:`, productData)

      // Tenta atualizar na API
      const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      console.log('Resposta da API:', response.status)

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors).flat().join(', ')
            errorMessage = `Erros de validação: ${validationErrors}`
          }
        } catch (e) {
          // Não conseguiu parsear JSON
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Produto atualizado com sucesso:', result)
      
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/products')
      }, 2000)

    } catch (err) {
      console.error('Erro ao atualizar produto:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produto #{productId}...</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 bg-green-100 rounded-full mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto Atualizado com Sucesso!</h2>
          <p className="text-gray-600 mb-6">
            As alterações do produto #{productId} foram salvas. Você será redirecionado para a lista de produtos.
          </p>
          <div className="animate-pulse text-green-600">
            Redirecionando...
          </div>
          <div className="mt-6">
            <Link 
              href="/products" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar para a lista de produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Produto #{productId}</h1>
            <p className="mt-2 text-gray-600">
              Atualize os dados do produto
            </p>
          </div>
          <Link 
            href="/products" 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            ← Voltar
          </Link>
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Nome do Produto */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ex: MacBook Pro M3"
                disabled={loading}
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Descreva características importantes do produto"
                disabled={loading}
              />
            </div>

            {/* Preço e Quantidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">R$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0,00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade em Estoque *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                  disabled={loading}
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map((category) => 
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Resumo das alterações */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Resumo das Alterações</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID do Produto:</span>
                  <span className="font-medium bg-gray-200 px-2 py-1 rounded">#{productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium">{formData.name || "Não informado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Novo Preço:</span>
                  <span className="font-medium text-green-600">
                    {formData.price ? `R$ ${parseFloat(formData.price).toFixed(2)}` : "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Novo Estoque:</span>
                  <span className={`font-medium ${formData.quantity ? (parseInt(formData.quantity) > 10 ? 'text-green-600' : parseInt(formData.quantity) > 0 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-600'}`}>
                    {formData.quantity ? `${formData.quantity} unidades` : "Não informado"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/products"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Atualizar Produto'
              )}
            </button>
          </div>

          {/* Informações da API */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="font-medium">Informações de integração:</p>
              <p>Endpoint: PUT http://localhost:8000/api/products/{productId}</p>
              <p>Headers: Content-Type: application/json</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
