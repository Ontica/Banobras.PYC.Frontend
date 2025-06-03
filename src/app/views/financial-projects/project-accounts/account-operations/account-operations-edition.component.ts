/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialAccountOperations, FinancialAccountOperations } from '@app/models';

import { ProjectAccountOperationAssignerEventType } from './account-operation-assigner.component';

import { ProjectAccountOperationsTableEventType } from './account-operations-table.component';


export enum ProjectAccountOperationsEditionEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialProjectAccountOperationsEditionComponent.Event.CloseButtonClicked',
  UPDATED              = 'FinancialProjectAccountOperationsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-account-operations-edition',
  templateUrl: './account-operations-edition.component.html',
})
export class FinancialProjectAccountOperationsEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() canEdit = false;

  @Output() projectAccountOperationsEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editar operaciones de la cuenta';

  data: FinancialAccountOperations = EmptyFinancialAccountOperations;

  submitted = false;


  constructor(private projectsData: FinancialProjectsDataService) { }


  ngOnChanges() {
    this.getAccountOperations(this.projectUID, this.accountUID);
  }


  onCloseButtonClicked() {
    sendEvent(this.projectAccountOperationsEditionEvent,
      ProjectAccountOperationsEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onProjectAccountOperationAssignerEvent(event: EventInfo) {
    switch (event.type as ProjectAccountOperationAssignerEventType) {
      case ProjectAccountOperationAssignerEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.operationUID, 'event.payload.operationUID');
        this.assignOrderItemEntry(event.payload.projectUID,
                                  event.payload.accountUID,
                                  event.payload.operationUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectAccountOperationsTableEvent(event: EventInfo) {
    switch (event.type as ProjectAccountOperationsTableEventType) {
      case ProjectAccountOperationsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.operationUID, 'event.payload.operationUID');
        this.removeOrderItemEntry(event.payload.projectUID,
                                  event.payload.accountUID,
                                  event.payload.operationUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getAccountOperations(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.getAccountOperations(projectUID, accountUID)
      .firstValue()
      .then(x => this.setAccountOperationsData(x))
      .finally(() => this.submitted = false);
  }


  private assignOrderItemEntry(projectUID: string, accountUID: string, operationUID: string) {
    this.submitted = true;

    this.projectsData.addAccountOperation(projectUID, accountUID, operationUID)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeOrderItemEntry(projectUID: string, accountUID: string, operationUID: string) {
    this.submitted = true;

    this.projectsData.removeAccountOperation(projectUID, accountUID, operationUID)
      .firstValue()
      .then(x => this.resolveOperationUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveOperationUpdated(data: FinancialAccountOperations) {
    this.setAccountOperationsData(data);
    sendEvent(this.projectAccountOperationsEditionEvent, ProjectAccountOperationsEditionEventType.UPDATED);
  }


  private setAccountOperationsData(data: FinancialAccountOperations) {
    this.data = data;
    this.setTexts();
  }


  private setTexts() {
    this.title = this.canEdit ?
    `Editar operaciones de la cuenta - ${this.data.account.accountNo}` :
    `Operaciones de la cuenta - ${this.data.account.accountNo}`;
  }

}
