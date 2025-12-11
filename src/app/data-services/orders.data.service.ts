/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Bill, DocumentFields, DocumentProduct ,OrderHolder, OrderDescriptor, OrderFields, OrderItem,
         OrderItemFields, OrdersQuery, ObjectTypes, OrdersAvailableQuery, OrderForEdition,
         PaymentOrderRequestFields } from '@app/models';


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


  getOrdersAvailable(query: OrdersAvailableQuery): EmpObservable<OrderForEdition[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/order-management/orders/available';

    return this.http.post<OrderForEdition[]>(path, query);
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


  requestPayment(orderUID: string,
                 dataFields: PaymentOrderRequestFields): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}/request-payment`;

    return this.http.post<OrderHolder>(path, dataFields);
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


  getOrdersBillTypes(): EmpObservable<DocumentProduct[]> {
    const path = `v8/order-management/orders/bill-types`;

    return this.http.get<DocumentProduct[]>(path);
  }


  upploadBill(orderUID: string,
              dataFields: DocumentFields,
              xmlFile: File,
              pdfFile: File): EmpObservable<Bill> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');
    Assertion.assertValue(xmlFile || pdfFile, 'xmlFile || pdfFile');

    const formData: FormData = new FormData();
    formData.append('document', JSON.stringify(dataFields));
    formData.append('xml', xmlFile);
    formData.append('pdf', pdfFile);

    const path = `v8/order-management/orders/${orderUID}/bills`;

    return this.http.post<Bill>(path, formData);
  }


  deleteBill(orderUID: string,
             billUID: string): EmpObservable<void> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(billUID, 'billUID');

    const path = `v8/order-management/orders/${orderUID}/bills/${billUID}`;

    return this.http.delete<void>(path);
  }

}
