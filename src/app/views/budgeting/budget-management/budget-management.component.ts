/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { BudgetsDataService } from '@app/data-services';

import { ObjectTypes, BudgetRequestFields, BudgetTransactionDescriptor,
         BudgetValidationResult } from '@app/models';

import { BudgetSubmitterEventType } from './budget-submitter.component';

export enum BudgetManagementEventType {
  UPDATED = 'BudgetManagementComponent.Event.Updated',
}

@Component({
  selector: 'emp-bdg-budget-management',
  templateUrl: './budget-management.component.html',
})
export class BudgetManagementComponent {

  @Input() baseObjectType: ObjectTypes = null;

  @Input() baseObjectUID = '';

  @Input() baseObjectName: string = '';

  @Input() budgetTotal: number = null;

  @Input() budgetTransactions: BudgetTransactionDescriptor[] = [];

  @Input() canRequest = false;

  @Output() budgetManagementEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private budgetsData: BudgetsDataService,
              private messageBox: MessageBoxService) { }


  onBudgetSubmitterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as BudgetSubmitterEventType) {
      case BudgetSubmitterEventType.REQUEST:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.requestBudget(event.payload.dataFields as BudgetRequestFields);
        return;

      case BudgetSubmitterEventType.VALIDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.validateAvaibleBudget(event.payload.dataFields as BudgetRequestFields);
        return
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  private requestBudget(dataFields: BudgetRequestFields){
    this.submitted = true;

    this.budgetsData.requestBudget(dataFields)
      .firstValue()
      .then(x => this.resolveBudgetUpdated())
      .finally(() => this.submitted = false);
  }


  private validateAvaibleBudget(dataFields: BudgetRequestFields) {
    this.submitted = true;

    this.budgetsData.validateAvaibleBudget(dataFields)
      .firstValue()
      .then(x => this.resolveValidateAvaibleBudget(x))
      .finally(() => this.submitted = false);
  }


  private resolveBudgetUpdated() {
    const payload = { baseObjectUID: this.baseObjectUID };
    sendEvent(this.budgetManagementEvent, BudgetManagementEventType.UPDATED, payload);
  }


  private resolveValidateAvaibleBudget(response: BudgetValidationResult) {
    this.messageBox.show(response.result, 'Validar presupuesto')
  }

}
