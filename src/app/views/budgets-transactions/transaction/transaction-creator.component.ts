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

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionFields } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionCreatorEventType {
  CREATED             = 'BudgetTransactionCreatorComponent.Event.TransactionCreated',
  CLOSE_MODAL_CLICKED = 'BudgetTransactionCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-bdg-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class BudgetTransactionCreatorComponent {

  @Output() transactionCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private transactionsData: BudgetTransactionsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onTransactionHeaderEvent(event: EventInfo) {
    switch (event.type as TransactionHeaderEventType) {
      case TransactionHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createTransaction(event.payload.dataFields as BudgetTransactionFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createTransaction(dataFields: BudgetTransactionFields) {
    this.submitted = true;

    this.transactionsData.createTransaction(dataFields)
      .firstValue()
      .then(x => sendEvent(this.transactionCreatorEvent, TransactionCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
