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

import { EmptyFinancialAccountOperationsTypes, FinancialAccountOperationsTypes,
         FinancialAccountOperationTypeFields } from '@app/models';

import { OperationTypeAssignerEventType } from './operation-type-assigner.component';

import { OperationsTypesTableEventType } from './operations-types-table.component';


export enum OperationsTypesEditionEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialAccountOperationsTypesEditionComponent.Event.CloseButtonClicked',
  UPDATED              = 'FinancialAccountOperationsTypesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-operations-types-edition',
  templateUrl: './operations-types-edition.component.html',
})
export class FinancialAccountOperationsTypesEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() canEdit = false;

  @Output() operationsTypesEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editar conceptos de la cuenta';

  data: FinancialAccountOperationsTypes = EmptyFinancialAccountOperationsTypes;

  submitted = false;


  constructor(private accountsData: ChartOfAccountsDataService,
              private projectsData: FinancialProjectsDataService) { }


  ngOnChanges() {
    if (!this.projectUID) {
      this.getProjectAccountOperationsTypes(this.projectUID, this.accountUID);
    } else {
      this.getAccountOperationsTypes(this.accountUID);
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.operationsTypesEditionEvent,
      OperationsTypesEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onOperationTypeAssignerEvent(event: EventInfo) {
    switch (event.type as OperationTypeAssignerEventType) {
      case OperationTypeAssignerEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addAccountOperationType(event.payload.accountUID,
                                     event.payload.dataFields as FinancialAccountOperationTypeFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationsTypesTableEvent(event: EventInfo) {
    switch (event.type as OperationsTypesTableEventType) {
      case OperationsTypesTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.operationTypeUID, 'event.payload.operationTypeUID');
        this.removeAccountOperationType(event.payload.accountUID,
                                        event.payload.operationTypeUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getProjectAccountOperationsTypes(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.getProjectAccountOperationsTypes(projectUID, accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsTypesData(x))
      .finally(() => this.submitted = false);
  }


  private getAccountOperationsTypes(accountUID: string) {
    this.submitted = true;

    this.accountsData.getAccountOperationsTypes(accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsTypesData(x))
      .finally(() => this.submitted = false);
  }


  private addAccountOperationType(accountUID: string, dataFields: FinancialAccountOperationTypeFields) {
    this.submitted = true;

    this.accountsData.addAccountOperationType(accountUID, dataFields.operationUID)
      .firstValue()
      .then(x => this.resolveOperationTypeUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeAccountOperationType(accountUID: string, operationTypeUID: string) {
    this.submitted = true;

    this.accountsData.removeAccountOperationType(accountUID, operationTypeUID)
      .firstValue()
      .then(x => this.resolveOperationTypeUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveOperationTypeUpdated(data: FinancialAccountOperationsTypes) {
    this.setAccountOperationsTypesData(data);
    sendEvent(this.operationsTypesEditionEvent, OperationsTypesEditionEventType.UPDATED);
  }


  private setAccountOperationsTypesData(data: FinancialAccountOperationsTypes) {
    this.data = data;
    this.setTexts();
  }


  private setTexts() {
    this.title = this.canEdit ?
    `Editar conceptos de la cuenta - ${this.data.account.accountNo}` :
    `Conceptos de la cuenta - ${this.data.account.accountNo}`;
  }

}
