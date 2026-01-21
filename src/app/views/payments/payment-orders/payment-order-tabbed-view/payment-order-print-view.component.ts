/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { PaymentOrdersDataService } from '@app/data-services';

@Component({
  selector: 'emp-pmt-payment-order-print-view',
  templateUrl: './payment-order-print-view.component.html',
})
export class PaymentOrderPrintViewComponent implements OnChanges {

  @Input() paymentOrderUID: string;

  fileUrl = '';

  isLoading = false;

  hasError = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService) { }


  ngOnChanges() {
    this.resetData();
    this.getDataForPrint();
  }


  onFileError() {
    this.hasError = true;
  }


  private getDataForPrint() {
    if (!this.paymentOrderUID) {
      return;
    }

    this.isLoading = true;

    this.paymentOrdersData.getPaymentOrderForPrint(this.paymentOrderUID)
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
