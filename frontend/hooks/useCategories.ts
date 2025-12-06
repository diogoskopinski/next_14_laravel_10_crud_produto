import { CATEGORIES, type Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/config/constants'

interface UseCategoriesReturn {
  categories: readonly Category[]
  getCategoryColor: (category: Category) => string
  getCategoryIcon: (category: Category) => string
  isValidCategory: (category: string) => category is Category
}

export function useCategories(): UseCategoriesReturn {
  const getCategoryColor = (category: Category): string => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.Geral
  }

  const getCategoryIcon = (category: Category): string => {
    return CATEGORY_ICONS[category] || CATEGORY_ICONS.Geral
  }

  const isValidCategory = (category: string): category is Category => {
    return CATEGORIES.includes(category as Category)
  }

  return {
    categories: CATEGORIES,
    getCategoryColor,
    getCategoryIcon,
    isValidCategory
  }
}
