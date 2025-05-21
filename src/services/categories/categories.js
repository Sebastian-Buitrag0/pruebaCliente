import { api } from 'src/boot/axios.js'

export const CategoryService = {
  async fetchCategories() {
    const response = await api.get('/Category')
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch category data')
    }
  },

  async fetchCategory(id) {
    const response = await api.get(`/Category/${id}`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch category data')
    }
  },

  async createCategory(category) {
    const response = await api.post('/Category', category)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Failed to create category')
    }
  },

  async updateCategory(category) {
    const response = await api.put(`/Category/${category.id}`, category)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to update category')
    }
  },

  async deleteCategory(id) {
    const response = await api.delete(`/Category/${id}`)
    if (response.status === 204) {
      return true
    } else {
      throw new Error('Failed to delete category')
    }
  },
}
