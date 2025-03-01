/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { FixedAssetTransactionsDataService } from '@app/data-services';

@Component({
  selector: 'emp-fa-transaction-print-view',
  templateUrl: './transaction-print-view.component.html',
})
export class FixedAssetTransactionPrintViewComponent implements OnChanges {

  @Input() transactionUID: string;

  fileUrl = '';

  isLoading = false;

  hasError = false;


  constructor(private fixedAssetTransactionsData: FixedAssetTransactionsDataService) {}


  ngOnChanges() {
    this.resetData();
    this.getTransactionForPrint();
  }


  onFileError() {
    this.hasError = true;
  }


  private getTransactionForPrint() {
    if (!this.transactionUID) {
      return;
    }

    this.isLoading = true;

    this.fixedAssetTransactionsData.getTransactionForPrint(this.transactionUID)
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
