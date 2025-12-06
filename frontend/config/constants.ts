export const CATEGORIES = [
  'Eletrônicos',
  'Livros',
  'Roupas',
  'Casa e Jardim',
  'Esportes',
  'Brinquedos',
  'Automotivo',
  'Saúde e Beleza',
  'Alimentos & Bebidas',
  'Materiais de Escritório',
  'Geral'
] as const

export type Category = typeof CATEGORIES[number]

// Outras constantes que você pode precisar
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export const APP_NAME = 'CRUD System'
export const APP_VERSION = '1.0.0'

// Constantes para tabela de produtos
export const PRODUCT_TABLE_COLUMNS = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Nome', width: '200px' },
  { key: 'description', label: 'Descrição', width: '300px' },
  { key: 'price', label: 'Preço', width: '120px' },
  { key: 'quantity', label: 'Quantidade', width: '120px' },
  { key: 'category', label: 'Categoria', width: '150px' },
  { key: 'created_at', label: 'Criado em', width: '150px' },
  { key: 'actions', label: 'Ações', width: '150px' },
]

// Cores para categorias (opcional)
export const CATEGORY_COLORS: Record<Category, string> = {
  'Eletrônicos': 'bg-blue-100 text-blue-800',
  'Livros': 'bg-green-100 text-green-800',
  'Roupas': 'bg-purple-100 text-purple-800',
  'Casa e Jardim': 'bg-yellow-100 text-yellow-800',
  'Esportes': 'bg-red-100 text-red-800',
  'Brinquedos': 'bg-pink-100 text-pink-800',
  'Automotivo': 'bg-indigo-100 text-indigo-800',
  'Saúde e Beleza': 'bg-teal-100 text-teal-800',
  'Alimentos & Bebidas': 'bg-orange-100 text-orange-800',
  'Materiais de Escritório': 'bg-gray-100 text-gray-800',
  'Geral': 'bg-gray-200 text-gray-800',
}

// Ícones para categorias (opcional)
export const CATEGORY_ICONS: Record<Category, string> = {
  'Eletrônicos': '💻',
  'Livros': '📚',
  'Roupas': '👕',
  'Casa e Jardim': '🏡',
  'Esportes': '⚽',
  'Brinquedos': '🧸',
  'Automotivo': '🚗',
  'Saúde e Beleza': '💄',
  'Alimentos & Bebidas': '🍎',
  'Materiais de Escritório': '📎',
  'Geral': '📦',
}
