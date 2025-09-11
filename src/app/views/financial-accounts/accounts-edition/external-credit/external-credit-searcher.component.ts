/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() externalCreditSearcherEvent = new EventEmitter<EventInfo>();

  externalCreditNo = null;

  isLoading = false;


  constructor(private accountsData: FinancialAccountsDataService) { }


  @SkipIf('isLoading')
  onExternalCreditSearch() {
    this.getAccountFromCreditSystem();
  }


  onExternalCreditClear() {
    this.externalCreditNo = null;
    this.emitData(null)
  }


  private getAccountFromCreditSystem() {
    this.isLoading = true;

    this.accountsData.getAccountFromCreditSystem(this.externalCreditNo)
      .firstValue()
      .then(x => this.emitData(x))
      .catch(e => this.emitData(null))
      .finally(() => this.isLoading = false);
  }


  private emitData(data: FinancialAccount) {
    sendEvent(this.externalCreditSearcherEvent, ExternalCreditSearcherEventType.DATA_CHANGED,
      { data });
  }

}
