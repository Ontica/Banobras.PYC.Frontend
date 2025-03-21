/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { AssetsTransactionsDataService } from '@app/data-services';

@Component({
  selector: 'emp-pyc-transaction-print-view',
  templateUrl: './transaction-print-view.component.html',
})
export class AssetTransactionPrintViewComponent implements OnChanges {

  @Input() transactionUID: string;

  fileUrl = '';

  isLoading = false;

  hasError = false;


  constructor(private transactionsData: AssetsTransactionsDataService) {}


  ngOnChanges() {
    this.resetData();
    this.getDataForPrint();
  }


  onFileError() {
    this.hasError = true;
  }


  private getDataForPrint() {
    if (!this.transactionUID) {
      return;
    }

    this.isLoading = true;

    this.transactionsData.getAssetTransactionForPrint(this.transactionUID)
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
