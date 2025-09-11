/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountsDataService } from '@app/data-services';

import { EmptyFinancialAccountOperationsStructure, FinancialAccountOperationsStructure } from '@app/models';

import { OperationsEditionEventType } from './operations-edition.component';


export enum OperationsModalEventType {
  CLOSE_MODAL_CLICKED = 'FinancialAccountOperationsModalComponent.Event.CloseModalClicked',
  UPDATED             = 'FinancialAccountOperationsModalComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-operations-modal',
  templateUrl: './operations-modal.component.html',
})
export class FinancialAccountOperationsModalComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() canEdit = false;

  @Output() operationsModalEvent = new EventEmitter<EventInfo>();

  data: FinancialAccountOperationsStructure = EmptyFinancialAccountOperationsStructure;

  isLoading = false;


  constructor(private accountsData: FinancialAccountsDataService) { }


  ngOnChanges() {
    if (!!this.projectUID) {
      this.getProjectAccountOperations(this.projectUID, this.accountUID);
    } else {
      this.getAccountOperations(this.accountUID);
    }
  }


  get title(): string {
    return this.canEdit ?
      `Editar conceptos de la cuenta - ${this.data.baseAccount.accountNo}` :
      `Conceptos de la cuenta - ${this.data.baseAccount.accountNo}`;
  }


  onCloseModalClicked() {
    sendEvent(this.operationsModalEvent, OperationsModalEventType.CLOSE_MODAL_CLICKED);
  }


  onOperationsEditionEvent(event: EventInfo) {
    switch (event.type as OperationsEditionEventType) {
      case OperationsEditionEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.setAccountOperationsData(event.payload.data);
        sendEvent(this.operationsModalEvent, OperationsModalEventType.UPDATED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getProjectAccountOperations(projectUID: string, accountUID: string) {
    this.isLoading = true;

    this.accountsData.getProjectAccountOperations(projectUID, accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsData(x))
      .finally(() => this.isLoading = false);
  }


  private getAccountOperations(accountUID: string) {
    this.isLoading = true;

    this.accountsData.getAccountOperations(accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsData(x))
      .finally(() => this.isLoading = false);
  }


  private setAccountOperationsData(data: FinancialAccountOperationsStructure) {
    this.data = data;
  }

}
