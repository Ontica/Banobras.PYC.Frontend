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

import { EmptyFinancialAccountOperationsHolder, FinancialAccountOperationsHolder,
         FinancialAccountOperationFields } from '@app/models';

import { OperationAssignerEventType } from './operation-assigner.component';

import { OperationsTableEventType } from './operations-table.component';


export enum OperationsEditionEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialAccountOperationsEditionComponent.Event.CloseButtonClicked',
  UPDATED              = 'FinancialAccountOperationsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-operations-edition',
  templateUrl: './operations-edition.component.html',
})
export class FinancialAccountOperationsEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() canEdit = false;

  @Output() operationsEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editar conceptos de la cuenta';

  data: FinancialAccountOperationsHolder = EmptyFinancialAccountOperationsHolder;

  submitted = false;


  constructor(private accountsData: ChartOfAccountsDataService,
              private projectsData: FinancialProjectsDataService) { }


  ngOnChanges() {
    if (!!this.projectUID) {
      this.getProjectAccountOperations(this.projectUID, this.accountUID);
    } else {
      this.getAccountOperations(this.accountUID);
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.operationsEditionEvent, OperationsEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onOperationAssignerEvent(event: EventInfo) {
    switch (event.type as OperationAssignerEventType) {
      case OperationAssignerEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addAccountOperation(event.payload.accountUID,
                                 event.payload.dataFields as FinancialAccountOperationFields);
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
        this.removeAccountOperation(event.payload.accountUID,
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


  private addAccountOperation(accountUID: string, dataFields: FinancialAccountOperationFields) {
    this.submitted = true;

    this.accountsData.addAccountOperation(accountUID, dataFields)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeAccountOperation(accountUID: string, operationUID: string) {
    this.submitted = true;

    this.accountsData.removeAccountOperation(accountUID, operationUID)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveOperationUpdated(data: FinancialAccountOperationsHolder) {
    this.setAccountOperationsData(data);
    sendEvent(this.operationsEditionEvent, OperationsEditionEventType.UPDATED);
  }


  private setAccountOperationsData(data: FinancialAccountOperationsHolder) {
    this.data = data;
    this.setTexts();
  }


  private setTexts() {
    this.title = this.canEdit ?
    `Editar conceptos de la cuenta - ${this.data.baseAccount.accountNo}` :
    `Conceptos de la cuenta - ${this.data.baseAccount.accountNo}`;
  }

}
