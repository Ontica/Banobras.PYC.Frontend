/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { buildExplorerHint, EmptyProductsQuery, ProductDescriptor, ProductsQuery } from '@app/models';

import { ProductsFilterEventType } from './products-filter.component';

import { ProductsTableEventType } from './products-table.component';


export enum ProductsExplorerEventType {
  CREATE_CLICKED            = 'ProductsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'ProductsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'ProductsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'ProductsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'ProductsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-products-explorer',
  templateUrl: './products-explorer.component.html',
})
export class ProductsExplorerComponent implements OnChanges {

  @Input() query: ProductsQuery = Object.assign({}, EmptyProductsQuery);

  @Input() dataList: ProductDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() productsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateProductClicked() {
    sendEvent(this.productsExplorerEvent, ProductsExplorerEventType.CREATE_CLICKED);
  }


  onProductsFilterEvent(event: EventInfo) {
    switch (event.type as ProductsFilterEventType) {
      case ProductsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.productsExplorerEvent, ProductsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case ProductsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.productsExplorerEvent, ProductsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProductsTableEvent(event: EventInfo) {
    switch (event.type as ProductsTableEventType) {
      case ProductsTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.productsExplorerEvent, ProductsExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case ProductsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.productsExplorerEvent, ProductsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }

}
