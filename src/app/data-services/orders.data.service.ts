/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { OrderHolder, OrderDescriptor, OrderFields, OrderItem, OrderItemFields, OrdersQuery,
         ObjectTypes } from '@app/models';


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


  createOrder(dataFields: OrderFields): EmpObservable<OrderHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders`;

    return this.http.post<OrderHolder>(path, dataFields);
  }


  updateOrder(orderUID: string,
              dataFields: OrderFields): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}`;

    return this.http.put<OrderHolder>(path, dataFields);
  }


  deleteOrder(orderUID: string): EmpObservable<void> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}`;

    return this.http.delete<void>(path);
  }


  suspendOrder(orderUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}/suspend`;

    return this.http.post<OrderHolder>(path);
  }


  activateOrder(orderUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}/activate`;

    return this.http.post<OrderHolder>(path);
  }


  getOrderAvailableItems(orderUID: string): EmpObservable<OrderItem[]> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}/available-items`;

    return this.http.get<OrderItem[]>(path);
  }


  addOrderItem(orderUID: string,
               dataFields: OrderItemFields): EmpObservable<OrderItem> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}/items`;

    return this.http.post<OrderItem>(path, dataFields);
  }


  updateOrderItem(orderUID: string,
                  orderItemUID: string,
                  dataFields: OrderItemFields): EmpObservable<OrderItem> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderItemUID, 'orderItemUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}/items/${orderItemUID}`;

    return this.http.put<OrderItem>(path, dataFields);
  }


  removeOrderItem(orderUID: string,
                  orderItemUID: string): EmpObservable<void> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderItemUID, 'orderItemUID');

    const path = `v8/order-management/orders/${orderUID}/items/${orderItemUID}`;

    return this.http.delete<void>(path);
  }

}
