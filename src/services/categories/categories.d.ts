import type { CategoryResponse, CategoryRequest } from './generated-api/api'

export const CategoryService: {
  fetchCategories: () => Promise<CategoryResponse[]>
  createCategory: (categoryData: CategoryRequest) => Promise<CategoryResponse>
  updateCategory: (categoryId: number, categoryData: CategoryRequest) => Promise<CategoryResponse>
  deleteCategory: (categoryId: number) => Promise<void>
}
