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

import {
  CashBoxRequest,
  CashBoxResponse,
  CategoryRequest,
  CategoryResponse,
  ProductRequest,
  ProductResponse,
  ProductSaleRequest,
  ProductSaleResponse,
  RefreshTokenRequest,
  RoleRequest,
  RoleResponse,
  SaleRequest,
  SaleResponse,
  UserDataRequest,
  UserDataResponse,
  UserLoginRequest,
  UserRequest,
  UserResponse,
} from './data-contracts'
import { ContentType, HttpClient, RequestParams } from './http-client'

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Auth
   * @name AuthLoginCreate
   * @request POST:/api/Auth/login
   * @secure
   */
  authLoginCreate = (data: UserLoginRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Auth/login`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRegisterCreate
   * @request POST:/api/Auth/register
   * @secure
   */
  authRegisterCreate = (data: UserRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Auth/register`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRefreshTokenCreate
   * @request POST:/api/Auth/refresh-token
   * @secure
   */
  authRefreshTokenCreate = (data: RefreshTokenRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Auth/refresh-token`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags CashBox
   * @name CashBoxList
   * @request GET:/api/CashBox
   * @secure
   */
  cashBoxList = (params: RequestParams = {}) =>
    this.request<CashBoxResponse[], any>({
      path: `/api/CashBox`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags CashBox
   * @name CashBoxCreate
   * @request POST:/api/CashBox
   * @secure
   */
  cashBoxCreate = (data: CashBoxRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/CashBox`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags CashBox
   * @name CashBoxDetail
   * @request GET:/api/CashBox/{id}
   * @secure
   */
  cashBoxDetail = (id: string, params: RequestParams = {}) =>
    this.request<CashBoxResponse, any>({
      path: `/api/CashBox/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags CashBox
   * @name CashBoxUpdate
   * @request PUT:/api/CashBox/{id}
   * @secure
   */
  cashBoxUpdate = (id: string, data: CashBoxRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/CashBox/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags CashBox
   * @name CashBoxDelete
   * @request DELETE:/api/CashBox/{id}
   * @secure
   */
  cashBoxDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/CashBox/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags Category
   * @name CategoryList
   * @request GET:/api/Category
   * @secure
   */
  categoryList = (params: RequestParams = {}) =>
    this.request<CategoryResponse[], any>({
      path: `/api/Category`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Category
   * @name CategoryCreate
   * @request POST:/api/Category
   * @secure
   */
  categoryCreate = (data: CategoryRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Category`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Category
   * @name CategoryDetail
   * @request GET:/api/Category/{id}
   * @secure
   */
  categoryDetail = (id: string, params: RequestParams = {}) =>
    this.request<CategoryResponse, any>({
      path: `/api/Category/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Category
   * @name CategoryUpdate
   * @request PUT:/api/Category/{id}
   * @secure
   */
  categoryUpdate = (id: string, data: CategoryRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Category/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Category
   * @name CategoryDelete
   * @request DELETE:/api/Category/{id}
   * @secure
   */
  categoryDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Category/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags Product
   * @name ProductList
   * @request GET:/api/Product
   * @secure
   */
  productList = (params: RequestParams = {}) =>
    this.request<ProductResponse[], any>({
      path: `/api/Product`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Product
   * @name ProductCreate
   * @request POST:/api/Product
   * @secure
   */
  productCreate = (data: ProductRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Product`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Product
   * @name ProductDetail
   * @request GET:/api/Product/{id}
   * @secure
   */
  productDetail = (id: string, params: RequestParams = {}) =>
    this.request<ProductResponse, any>({
      path: `/api/Product/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Product
   * @name ProductUpdate
   * @request PUT:/api/Product/{id}
   * @secure
   */
  productUpdate = (id: string, data: ProductRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Product/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Product
   * @name ProductDelete
   * @request DELETE:/api/Product/{id}
   * @secure
   */
  productDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Product/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags ProductSale
   * @name ProductSaleList
   * @request GET:/api/ProductSale
   * @secure
   */
  productSaleList = (params: RequestParams = {}) =>
    this.request<ProductSaleResponse[], any>({
      path: `/api/ProductSale`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags ProductSale
   * @name ProductSaleCreate
   * @request POST:/api/ProductSale
   * @secure
   */
  productSaleCreate = (data: ProductSaleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/ProductSale`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags ProductSale
   * @name ProductSaleDetail
   * @request GET:/api/ProductSale/{id}
   * @secure
   */
  productSaleDetail = (id: string, params: RequestParams = {}) =>
    this.request<ProductSaleResponse, any>({
      path: `/api/ProductSale/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags ProductSale
   * @name ProductSaleUpdate
   * @request PUT:/api/ProductSale/{id}
   * @secure
   */
  productSaleUpdate = (id: string, data: ProductSaleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/ProductSale/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags ProductSale
   * @name ProductSaleDelete
   * @request DELETE:/api/ProductSale/{id}
   * @secure
   */
  productSaleDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/ProductSale/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags Rol
   * @name GetApi
   * @request GET:/api/Rol
   * @secure
   */
  getApi = (params: RequestParams = {}) =>
    this.request<RoleResponse[], any>({
      path: `/api/Rol`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Rol
   * @name PostApi
   * @request POST:/api/Rol
   * @secure
   */
  postApi = (data: RoleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Rol`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Rol
   * @name GetApi2
   * @request GET:/api/Rol/{id}
   * @originalName getApi
   * @duplicate
   * @secure
   */
  getApi2 = (id: string, params: RequestParams = {}) =>
    this.request<RoleResponse, any>({
      path: `/api/Rol/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Rol
   * @name PutApi
   * @request PUT:/api/Rol/{id}
   * @secure
   */
  putApi = (id: string, data: RoleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Rol/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Rol
   * @name DeleteApi
   * @request DELETE:/api/Rol/{id}
   * @secure
   */
  deleteApi = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Rol/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags Sale
   * @name SaleList
   * @request GET:/api/Sale
   * @secure
   */
  saleList = (params: RequestParams = {}) =>
    this.request<SaleResponse[], any>({
      path: `/api/Sale`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Sale
   * @name SaleCreate
   * @request POST:/api/Sale
   * @secure
   */
  saleCreate = (data: SaleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Sale`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Sale
   * @name SaleDetail
   * @request GET:/api/Sale/{id}
   * @secure
   */
  saleDetail = (id: string, params: RequestParams = {}) =>
    this.request<SaleResponse, any>({
      path: `/api/Sale/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Sale
   * @name SaleUpdate
   * @request PUT:/api/Sale/{id}
   * @secure
   */
  saleUpdate = (id: string, data: SaleRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Sale/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Sale
   * @name SaleDelete
   * @request DELETE:/api/Sale/{id}
   * @secure
   */
  saleDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/Sale/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags User
   * @name UserList
   * @request GET:/api/User
   * @secure
   */
  userList = (params: RequestParams = {}) =>
    this.request<UserResponse[], any>({
      path: `/api/User`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags User
   * @name UserCreate
   * @request POST:/api/User
   * @secure
   */
  userCreate = (data: UserRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/User`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags User
   * @name UserDetail
   * @request GET:/api/User/{id}
   * @secure
   */
  userDetail = (id: string, params: RequestParams = {}) =>
    this.request<UserResponse, any>({
      path: `/api/User/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags User
   * @name UserUpdate
   * @request PUT:/api/User/{id}
   * @secure
   */
  userUpdate = (id: string, data: UserRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/User/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags User
   * @name UserDelete
   * @request DELETE:/api/User/{id}
   * @secure
   */
  userDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/User/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags UserData
   * @name UserDataList
   * @request GET:/api/UserData
   * @secure
   */
  userDataList = (params: RequestParams = {}) =>
    this.request<UserDataResponse[], any>({
      path: `/api/UserData`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags UserData
   * @name UserDataCreate
   * @request POST:/api/UserData
   * @secure
   */
  userDataCreate = (data: UserDataRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/UserData`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags UserData
   * @name UserDataDetail
   * @request GET:/api/UserData/{id}
   * @secure
   */
  userDataDetail = (id: string, params: RequestParams = {}) =>
    this.request<UserDataResponse, any>({
      path: `/api/UserData/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags UserData
   * @name UserDataUpdate
   * @request PUT:/api/UserData/{id}
   * @secure
   */
  userDataUpdate = (id: string, data: UserDataRequest, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/UserData/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags UserData
   * @name UserDataDelete
   * @request DELETE:/api/UserData/{id}
   * @secure
   */
  userDataDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/UserData/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    })
}
