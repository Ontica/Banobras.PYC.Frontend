/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ProductsDataService } from '@app/data-services';

import { EmptyProductsQuery, ProductDescriptor, ProductsQuery } from '@app/models';

import { ProductsExplorerEventType } from '@app/views/products/products-explorer/products-explorer.component';


@Component({
  selector: 'emp-ng-products-main-page',
  templateUrl: './products-main-page.component.html',
})
export class ProductsMainPageComponent {

  query: ProductsQuery = Object.assign({}, EmptyProductsQuery);

  dataList: ProductDescriptor[] = [];

  isLoading = false;

  queryExecuted = false;


  constructor(private productsData: ProductsDataService,
              private messageBox: MessageBoxService) { }


  onProductsExplorerEvent(event: EventInfo) {
    switch (event.type as ProductsExplorerEventType) {
      case ProductsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProductsQuery);
        this.searchProducts(this.query);
        return;
      case ProductsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProductsQuery);
        return;
      case ProductsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchProducts(query: ProductsQuery) {
    this.isLoading = true;

    this.productsData.searchProducts(query)
      .firstValue()
      .then(x => this.resolveSearchProducts(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchProducts(data: ProductDescriptor[]) {
    this.setDataList(data, true);
  }


  private setQueryAndClearExplorerData(query: ProductsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setDataList(data: ProductDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
