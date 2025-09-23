/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountsDataService } from '@app/data-services';

import { FinancialAccount } from '@app/models';


export enum ExternalCreditSearcherEventType {
  DATA_CHANGED = 'ExternalCreditSearcherComponent.Event.DataChanged',
}

@Component({
  selector: 'emp-cf-external-credit-searcher',
  templateUrl: './external-credit-searcher.component.html',
})
export class ExternalCreditSearcherComponent {

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;

  @Output() externalCreditSearcherEvent = new EventEmitter<EventInfo>();

  externalCreditNo = null;

  hasValidData = false;

  isLoading = false;


  constructor(private accountsData: FinancialAccountsDataService) { }


  @SkipIf('isLoading')
  onExternalCreditSearch() {
    this.getAccountFromCreditSystem();
  }


  onExternalCreditClear() {
    this.externalCreditNo = null;
    this.clearData();
    this.focusInput();
  }


  private getAccountFromCreditSystem() {
    this.isLoading = true;

    this.accountsData.getAccountFromCreditSystem(this.externalCreditNo)
      .firstValue()
      .then(x => this.resolveData(x))
      .catch(e => this.clearData())
      .finally(() => this.isLoading = false);
  }


  private resolveData(data: FinancialAccount) {
    this.hasValidData = true;
    this.emitData(data);
  }


  private clearData() {
    this.hasValidData = false;
    this.emitData(null)
  }


  private emitData(data: FinancialAccount) {
    sendEvent(this.externalCreditSearcherEvent, ExternalCreditSearcherEventType.DATA_CHANGED,
      { data });
  }


  private focusInput() {
    setTimeout(() => this.inputSearch.nativeElement.focus());
  }

}
