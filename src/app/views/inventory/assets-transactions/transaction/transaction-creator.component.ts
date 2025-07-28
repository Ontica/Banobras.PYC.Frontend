/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetsTransactionFields } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionCreatorEventType {
  CREATED             = 'AssetsTransactionCreatorComponent.Event.TransactionCreated',
  CLOSE_MODAL_CLICKED = 'AssetsTransactionCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-inv-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class AssetsTransactionCreatorComponent {

  @Output() transactionCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private transactionsData: AssetsTransactionsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onTransactionHeaderEvent(event: EventInfo) {
    switch (event.type as TransactionHeaderEventType) {
      case TransactionHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createTransaction(event.payload.dataFields as AssetsTransactionFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createTransaction(dataFields: AssetsTransactionFields) {
    this.submitted = true;

    this.transactionsData.createAssetsTransaction(dataFields)
      .firstValue()
      .then(x => sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
