/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ChartOfAccountsDataService } from '@app/data-services';

import { EmptyFinancialAccountOperationsStructure, FinancialAccountOperationsStructure,
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
export class FinancialAccountOperationsEditionComponent {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() data: FinancialAccountOperationsStructure = EmptyFinancialAccountOperationsStructure;

  @Input() canEdit = false;

  @Input() isLoading = false;

  @Output() operationsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private accountsData: ChartOfAccountsDataService) { }


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


  private resolveOperationUpdated(data: FinancialAccountOperationsStructure) {
    sendEvent(this.operationsEditionEvent, OperationsEditionEventType.UPDATED, { data });
  }

}
