/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import {  ProductHolder, ProductDescriptor, ProductFields, ProductsQuery,
          BudgetAccountsForProductQuery } from '@app/models';


@Injectable()
export class ProductsDataService {


  constructor(private http: HttpService) { }


  getProductTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/product-management/product-types';

    return this.http.get<Identifiable[]>(path);
  }


  getProductCategories(): EmpObservable<Identifiable[]> {
    const path = 'v8/product-management/categories';

    return this.http.get<Identifiable[]>(path);
  }


  searchBudgetAccountsForProduct(productUID: string,
                                 query: BudgetAccountsForProductQuery): EmpObservable<Identifiable[]> {
    Assertion.assertValue(productUID, 'productUID');
    Assertion.assertValue(query, 'query');

    const path = `v8/product-management/products/${productUID}/budget-accounts`;

    return this.http.post<Identifiable[]>(path, query);
  }


  searchProducts(query: ProductsQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/product-management/products/search';

    return this.http.post<ProductDescriptor[]>(path, query);
  }


  getProduct(productUID: string): EmpObservable<ProductHolder> {
    Assertion.assertValue(productUID, 'productUID');

    const path = `v8/product-management/products/${productUID}`;

    return this.http.get<ProductHolder>(path);
  }


  createProduct(dataFields: ProductFields): EmpObservable<ProductHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/product-management/products/`;

    return this.http.post<ProductHolder>(path, dataFields);
  }


  updateProduct(productUID: string, dataFields: ProductFields): EmpObservable<ProductHolder> {
    Assertion.assertValue(productUID, 'productUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/product-management/products/${productUID}`;

    return this.http.put<ProductHolder>(path, dataFields);
  }


  deleteProduct(productUID: string): EmpObservable<void> {
    Assertion.assertValue(productUID, 'productUID');

    const path = `v8/product-management/products/${productUID}`;

    return this.http.delete<void>(path);
  }


  suspendProduct(productUID: string): EmpObservable<ProductHolder> {
    Assertion.assertValue(productUID, 'productUID');

    const path = `v8/product-management/products/${productUID}/suspend`;

    return this.http.post<ProductHolder>(path);
  }


  activateProduct(productUID: string): EmpObservable<ProductHolder> {
    Assertion.assertValue(productUID, 'productUID');

    const path = `v8/product-management/products/${productUID}/activate`;

    return this.http.post<ProductHolder>(path);
  }

}
