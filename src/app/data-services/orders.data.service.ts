/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { OrderHolder, OrderDescriptor, OrdersQuery, ObjectTypes } from '@app/models';


@Injectable()
export class OrdersDataService {


  constructor(private http: HttpService) { }


  getOrderCategories(orderType: ObjectTypes): EmpObservable<Identifiable[]> {
    Assertion.assertValue(orderType, 'orderType');

    const path = `v8/order-management/order-types/${orderType}/categories`;

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: OrdersQuery): EmpObservable<OrderDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/order-management/orders/search';

    return this.http.post<OrderDescriptor[]>(path, query);
  }


  getOrder(orderUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}`;

    return this.http.get<OrderHolder>(path);
  }

}
