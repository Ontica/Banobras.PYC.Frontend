/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ChartOfAccountsDataService, FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialAccountOperations, FinancialAccountOperations } from '@app/models';

import { OperationAssignerEventType } from './operation-assigner.component';

import { OperationsTableEventType } from './operations-table.component';


export enum OperationsEditionEventType {
  CLOSE_BUTTON_CLICKED = 'OperationsEditionComponent.Event.CloseButtonClicked',
  UPDATED              = 'OperationsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-operations-edition',
  templateUrl: './operations-edition.component.html',
})
export class OperationsEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() canEdit = false;

  @Output() operationsEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editar conceptos de la cuenta';

  data: FinancialAccountOperations = EmptyFinancialAccountOperations;

  submitted = false;


  constructor(private accountsData: ChartOfAccountsDataService,
              private projectsData: FinancialProjectsDataService) { }


  ngOnChanges() {
    if (!this.projectUID) {
      this.getProjectAccountOperations(this.projectUID, this.accountUID);
    } else {
      this.getAccountOperations(this.accountUID);
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.operationsEditionEvent,
      OperationsEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onOperationAssignerEvent(event: EventInfo) {
    switch (event.type as OperationAssignerEventType) {
      case OperationAssignerEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.operationUID, 'event.payload.operationUID');
        this.assignOrderItemEntry(event.payload.accountUID,
                                  event.payload.operationUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationsTableEvent(event: EventInfo) {
    switch (event.type as OperationsTableEventType) {
      case OperationsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.operationUID, 'event.payload.operationUID');
        this.removeOrderItemEntry(event.payload.accountUID,
                                  event.payload.operationUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getProjectAccountOperations(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.getProjectAccountOperations(projectUID, accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsData(x))
      .finally(() => this.submitted = false);
  }


  private getAccountOperations(accountUID: string) {
    this.submitted = true;

    this.accountsData.getAccountOperations(accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsData(x))
      .finally(() => this.submitted = false);
  }


  private assignOrderItemEntry(accountUID: string, operationUID: string) {
    this.submitted = true;

    this.accountsData.addAccountOperation(accountUID, operationUID)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeOrderItemEntry(accountUID: string, operationUID: string) {
    this.submitted = true;

    this.accountsData.removeAccountOperation(accountUID, operationUID)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveOperationUpdated(data: FinancialAccountOperations) {
    this.setAccountOperationsData(data);
    sendEvent(this.operationsEditionEvent, OperationsEditionEventType.UPDATED);
  }


  private setAccountOperationsData(data: FinancialAccountOperations) {
    this.data = data;
    this.setTexts();
  }


  private setTexts() {
    this.title = this.canEdit ?
    `Editar conceptos de la cuenta - ${this.data.account.accountNo}` :
    `Conceptos de la cuenta - ${this.data.account.accountNo}`;
  }

}
