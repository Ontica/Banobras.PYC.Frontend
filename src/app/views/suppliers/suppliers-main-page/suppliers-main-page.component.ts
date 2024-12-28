/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SuppliersDataService } from '@app/data-services';

import { EmptySuppliersDataTable, EmptySuppliersQuery, SupplierDescriptor, SuppliersDataTable,
         SuppliersQuery } from '@app/models';

import {
  SuppliersExplorerEventType
} from '@app/views/suppliers/suppliers-explorer/suppliers-explorer.component';


@Component({
  selector: 'emp-ng-suppliers-main-page',
  templateUrl: './suppliers-main-page.component.html',
})
export class SuppliersMainPageComponent {

  query: SuppliersQuery = Object.assign({}, EmptySuppliersQuery);

  dataList: SuppliersDataTable = Object.assign({}, EmptySuppliersDataTable);

  isLoading = false;

  queryExecuted = false;


  constructor(private suppliersData: SuppliersDataService) { }


  onSuppliersExplorerEvent(event: EventInfo) {
    switch (event.type as SuppliersExplorerEventType) {
      case SuppliersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as SuppliersQuery);
        this.searchSuppliers(this.query);
        return;
      case SuppliersExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as SuppliersQuery);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchSuppliers(query: SuppliersQuery) {
    this.isLoading = true;

    this.suppliersData.searchSuppliers(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private setQueryAndClearExplorerData(query: SuppliersQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setDataList(data: SupplierDescriptor[], queryExecuted: boolean = true) {
    this.dataList = Object.assign({}, this.dataList, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }

}
