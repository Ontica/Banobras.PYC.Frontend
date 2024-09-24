/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PayablesDataService } from '@app/data-services';

import { EmptyPayablesQuery, PayableDescriptor, PayablesQuery } from '@app/models';

import { PayablesExplorerEventType } from '../payables-explorer/payables-explorer.component';


@Component({
  selector: 'emp-payments-payables-main-page',
  templateUrl: './payables-main-page.component.html',
})
export class PayablesMainPageComponent {

  query: PayablesQuery = Object.assign({}, EmptyPayablesQuery);

  dataList: PayableDescriptor[] = [];

  selectedUID = '';

  isLoading = false;

  queryExecuted = false;


  constructor(private payablesData: PayablesDataService,
              private messageBox: MessageBoxService)  { }


  onPayablesExplorerEvent(event: EventInfo) {
    switch (event.type as PayablesExplorerEventType) {
      case PayablesExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PayablesQuery);
        this.searchPayables(this.query);
        return;

      case PayablesExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PayablesQuery);
        return;

      case PayablesExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Detalle de la obligación de pago', event.payload);
        return;

      case PayablesExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPayables(query: PayablesQuery) {
    this.isLoading = true;

    this.payablesData.searchPayables(query)
      .firstValue()
      .then(x => this.resolveSearchPayables(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchPayables(data: PayableDescriptor[]) {
    this.setPayablesList(data, true);
  }


  private setQueryAndClearExplorerData(query: PayablesQuery) {
    this.query = Object.assign({}, query);
    this.clearPayablesList();
  }


  private clearPayablesList() {
    this.setPayablesList([], false);
  }


  private setPayablesList(data: PayableDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
