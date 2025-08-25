/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { CashLedgerDataService } from '@app/data-services';

@Component({
  selector: 'emp-cf-cash-transaction-print-view',
  templateUrl: './transaction-print-view.component.html',
})
export class CashTransactionPrintViewComponent implements OnChanges {

  @Input() transactionID: number;

  fileUrl = '';

  isLoading = false;

  hasError = false;


  constructor(private cashLedgerData: CashLedgerDataService) {}


  ngOnChanges() {
    this.resetData();
    this.getDataForPrint();
  }


  onFileError() {
    this.hasError = true;
  }


  private getDataForPrint() {
    if (!this.transactionID) {
      return;
    }

    this.isLoading = true;

    this.cashLedgerData.getCashTransactionForPrint(this.transactionID)
      .firstValue()
      .then(x => this.fileUrl = x.url)
      .catch(() => this.onFileError())
      .finally(() => this.isLoading = false);
  }


  private resetData() {
    this.hasError = false;
    this.fileUrl = null;
  }

}
