/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { CashFlowProjectionsDataService } from '@app/data-services';

@Component({
  selector: 'emp-cf-projection-print-view',
  templateUrl: './projection-print-view.component.html',
})
export class CashFlowProjectionPrintViewComponent implements OnChanges {

  @Input() projectionUID: string;

  fileUrl = '';

  isLoading = false;

  hasError = false;


  constructor(private projectionsData: CashFlowProjectionsDataService) {}


  ngOnChanges() {
    this.resetData();
    this.getDataForPrint();
  }


  onFileError() {
    this.hasError = true;
  }


  private getDataForPrint() {
    if (!this.projectionUID) {
      return;
    }

    this.isLoading = true;

    this.projectionsData.getProjectionForPrint(this.projectionUID)
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
