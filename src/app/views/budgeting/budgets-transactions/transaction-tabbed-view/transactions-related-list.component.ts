/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { FilePreviewComponent } from '@app/shared/containers';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionDescriptor, FileReport } from '@app/models';

import {
  TransactionsListEventType
} from '../transactions-explorer/transactions-list.component';

export enum BudgetTransactionsRelatedListEventType {

}

@Component({
  selector: 'emp-bdg-transactions-related-list',
  templateUrl: './transactions-related-list.component.html',
})
export class BudgetTransactionsRelatedListComponent {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() transactions: BudgetTransactionDescriptor[] = [];

  @Output() budgetManagementEvent = new EventEmitter<EventInfo>();

  submitted = false;

  isLoading = false;


  constructor(private transactionsData: BudgetTransactionsDataService) { }


  onTransactionsListEvent(event: EventInfo) {
    switch (event.type as TransactionsListEventType) {
      case TransactionsListEventType.SHOW_FILE_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        Assertion.assertValue(event.payload.transaction.uid, 'event.payload.transaction.uid');
        this.getTransactionForPrint(event.payload.transaction.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getTransactionForPrint(transactionUID: string) {
    this.isLoading = true;

    this.transactionsData.getTransactionForPrint(transactionUID)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
