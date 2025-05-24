import { api } from 'src/boot/axios.js'

export const ProductService = {
  async fetchProducts() {
    const response = await api.get('/api/Product')
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch product data')
    }
  },

  async fetchProduct(id) {
    const response = await api.get(`/api/Product/${id}`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch product data')
    }
  },

  async createProduct(product) {
    const response = await api.post('/api/Product', product)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Failed to create product')
    }
  },

  async updateProduct(id, product) {
    const response = await api.put(`/api/Product/${id}`, product, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 200 || response.status === 204) {
      return true
    } else {
      throw new Error('Failed to update product')
    }
  },

  async deleteProduct(id) {
    const response = await api.delete(`/api/Product/${id}`)
    if (response.status === 204) {
      return true
    } else {
      throw new Error('Failed to delete product')
    }
  },
}
