/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetTransactionFields } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionCreatorEventType {
  CREATED             = 'AssetTransactionCreatorComponent.Event.TransactionCreated',
  CLOSE_MODAL_CLICKED = 'AssetTransactionCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-pyc-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class AssetTransactionCreatorComponent {

  @Output() transactionCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private transactionsData: AssetsTransactionsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onTransactionHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionHeaderEventType) {
      case TransactionHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createTransaction(event.payload.dataFields as AssetTransactionFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createTransaction(dataFields: AssetTransactionFields) {
    this.submitted = true;

    this.transactionsData.createAssetTransaction(dataFields)
      .firstValue()
      .then(x => sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
