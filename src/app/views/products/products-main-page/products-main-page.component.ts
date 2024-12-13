/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { ProductsDataService } from '@app/data-services';

import { EmptyProductHolder, EmptyProductsQuery, mapProductDescriptorFromProduct, ProductDescriptor,
         ProductHolder, ProductsQuery } from '@app/models';

import { ProductCreatorEventType } from '../product/product-creator.component';

import { ProductsExplorerEventType } from '@app/views/products/products-explorer/products-explorer.component';

import { ProductTabbedViewEventType } from '../product-tabbed-view/product-tabbed-view.component';


@Component({
  selector: 'emp-ng-products-main-page',
  templateUrl: './products-main-page.component.html',
})
export class ProductsMainPageComponent {

  query: ProductsQuery = Object.assign({}, EmptyProductsQuery);

  dataList: ProductDescriptor[] = [];

  selectedData: ProductHolder = EmptyProductHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private productsData: ProductsDataService,
              private messageBox: MessageBoxService) { }


  onProductCreatorEvent(event: EventInfo) {
    switch (event.type as ProductCreatorEventType) {
      case ProductCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case ProductCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.resolveDataUpdated(event.payload.data as ProductHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProductsExplorerEvent(event: EventInfo) {
    switch (event.type as ProductsExplorerEventType) {
      case ProductsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
      case ProductsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProductsQuery);
        this.searchProducts(this.query);
        return;
      case ProductsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProductsQuery);
        return;
      case ProductsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getProduct(event.payload.item.uid);
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


  onProductTabbedViewEvent(event: EventInfo) {
    switch (event.type as ProductTabbedViewEventType) {
      case ProductTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyProductHolder);
        return;
      case ProductTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.product, 'event.payload.product');
        this.resolveDataUpdated(event.payload.product as ProductHolder);
        return;
      case ProductTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.productUID, 'event.payload.productUID');
        this.resolveDataDeleted(event.payload.productUID as string);
        return;
      case ProductTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.productUID, 'event.payload.productUID');
        this.refreshSelectedData(event.payload.productUID);
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
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getProduct(productUID: string) {
    this.isLoadingSelection = true;

    this.productsData.getProduct(productUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveDataUpdated(data: ProductHolder) {
    this.insertItemToList(data);
    this.setSelectedData(data);
  }


  private resolveDataDeleted(dataUID: string) {
    this.removeItemFromList(dataUID);
    this.setSelectedData(EmptyProductHolder);
  }


  private refreshSelectedData(productUID: string) {
    this.getProduct(productUID);
  }


  private setQueryAndClearExplorerData(query: ProductsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyProductHolder);
  }


  private setDataList(data: ProductDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: ProductHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.product);
  }


  private insertItemToList(data: ProductHolder) {
    const dataToInsert = mapProductDescriptorFromProduct(data.product);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew, true);
  }


  private removeItemFromList(datatUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== datatUID);
    this.setDataList(dataListNew);
  }

}
