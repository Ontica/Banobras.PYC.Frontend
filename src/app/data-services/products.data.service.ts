/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import {  ProductDescriptor, ProductsQuery } from '@app/models';


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


  searchProducts(query: ProductsQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/product-management/products/search';

    return this.http.post<ProductDescriptor[]>(path, query);
  }

}
