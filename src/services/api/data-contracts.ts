/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CashBoxRequest {
  /** @format date-time */
  date: string
  /** @format double */
  amount: number
  type: TransactionType
  /** @format uuid */
  saleId?: string | null
}

export interface CashBoxResponse {
  /** @format uuid */
  id?: string
  /** @format date-time */
  date?: string
  /** @format double */
  amount?: number
  type?: TransactionType
  /** @format uuid */
  saleId?: string | null
}

export interface Category {
  name?: string | null
  description?: string | null
}

export interface CategoryRequest {
  /** @minLength 1 */
  name: string
  description?: string | null
}

export interface CategoryResponse {
  /** @format uuid */
  id?: string
  name?: string | null
  description?: string | null
}

export interface Product {
  /** @format uuid */
  categoryId?: string
  category?: Category
  /** @format uuid */
  id?: string
  name?: string | null
  description?: string | null
  /** @format double */
  price?: number
}

export interface ProductRequest {
  /** @format uuid */
  categoryId: string
  /** @minLength 1 */
  name: string
  description?: string | null
  /** @format double */
  price: number
}

export interface ProductResponse {
  category?: Category
  /** @format uuid */
  categoryId?: string
  /** @format uuid */
  id?: string
  name?: string | null
  description?: string | null
  /** @format double */
  price?: number
}

export interface ProductSale {
  product?: Product
  /** @format double */
  amount?: number
  /** @format int32 */
  quantity?: number
}

export interface ProductSaleRequest {
  /** @format uuid */
  product: string
  /** @format int32 */
  quantity: number
}

export interface ProductSaleResponse {
  /** @format uuid */
  id?: string
  product?: Product
  /** @format double */
  amount?: number
  /** @format int32 */
  quantity?: number
}

export interface RefreshTokenRequest {
  /** @minLength 1 */
  token: string
}

export interface Role {
  name?: string | null
  description?: string | null
}

export interface RoleRequest {
  /** @minLength 1 */
  name: string
  description?: string | null
}

export interface RoleResponse {
  /** @format uuid */
  id?: string
  name?: string | null
  description?: string | null
}

export interface SaleRequest {
  /** @format uuid */
  user: string
  productsSale: string[]
  /** @format date-time */
  saleDate?: string
}

export interface SaleResponse {
  user?: User
  products?: ProductSale[] | null
  /** @format uuid */
  id?: string
  /** @format date-time */
  saleDate?: string
  /** @format double */
  amount?: number
  /** @format int32 */
  quantity?: number
}

/** @format int32 */
export enum TransactionType {
  Value0 = 0,
  Value1 = 1,
}

export interface User {
  userData?: UserData
  role?: Role
  username?: string | null
  password?: string | null
}

export interface UserData {
  name?: string | null
  lastName?: string | null
  /** @format date */
  birth?: string
  email?: string | null
  phone?: string | null
}

export interface UserDataRequest {
  /** @minLength 1 */
  name: string
  lastName?: string | null
  /** @format date */
  birth?: string
  /**
   * @format email
   * @minLength 1
   */
  email: string
  phone?: string | null
}

export interface UserDataResponse {
  /** @format uuid */
  id?: string
  name?: string | null
  lastName?: string | null
  /** @format date */
  birth?: string
  email?: string | null
  phone?: string | null
}

export interface UserLoginRequest {
  username?: string | null
  password?: string | null
}

export interface UserRequest {
  userData: UserData
  /** @format uuid */
  role: string
  /** @minLength 1 */
  username: string
  /**
   * @minLength 6
   * @maxLength 100
   */
  password: string
}

export interface UserResponse {
  userData?: UserData
  role?: Role
  /** @format uuid */
  id?: string
  username?: string | null
  password?: string | null
}
