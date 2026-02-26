/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { FilePreviewComponent } from '@app/shared/containers';

import { BudgetTransactionsDataService, BudgetsDataService } from '@app/data-services';

import { ObjectTypes, BudgetRequestFields, BudgetTransactionDescriptor, BudgetValidationResult,
         FileReport } from '@app/models';

import { BudgetSubmitterEventType } from './budget-submitter.component';

import {
  TransactionsListEventType
} from '../budgets-transactions/transactions-explorer/transactions-list.component';

import {
  TravelExpensesRequestEventType
} from '@app/views/payments/payments-management/travel-expenses/travel-expenses-request.component';

export enum BudgetManagementEventType {
  UPDATED = 'BudgetManagementComponent.Event.Updated',
}

@Component({
  selector: 'emp-bdg-budget-management',
  templateUrl: './budget-management.component.html',
})
export class BudgetManagementComponent {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() baseObjectType: ObjectTypes = null;

  @Input() baseObjectUID = '';

  @Input() baseObjectName: string = '';

  @Input() budgetTotal: number = null;

  @Input() budgetTransactions: BudgetTransactionDescriptor[] = [];

  @Input() canApprove = false;

  @Input() canCommit = false;

  @Input() canExercise = false;

  @Input() canRequest = false;

  @Input() canValidate = false;

  @Input() canRequestTravelExpenses = false;

  @Output() budgetManagementEvent = new EventEmitter<EventInfo>();

  submitted = false;

  isLoading = false;

  displayTravelExpensesRequest = false;


  constructor(private budgetsData: BudgetsDataService,
              private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onBudgetSubmitterEvent(event: EventInfo) {
    switch (event.type as BudgetSubmitterEventType) {
      case BudgetSubmitterEventType.APPROVE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.approvePayment(event.payload.dataFields as BudgetRequestFields);
        return;
      case BudgetSubmitterEventType.COMMIT:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.commitBudget(event.payload.dataFields as BudgetRequestFields);
        return;
      case BudgetSubmitterEventType.EXERCISE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.exerciseBudget(event.payload.dataFields as BudgetRequestFields);
        return;
      case BudgetSubmitterEventType.REQUEST:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.requestBudget(event.payload.dataFields as BudgetRequestFields);
        return;
      case BudgetSubmitterEventType.VALIDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.validateAvaibleBudget(event.payload.dataFields as BudgetRequestFields);
        return;
      case BudgetSubmitterEventType.REQUEST_TRAVEL_EXPENSES:
        this.displayTravelExpensesRequest = true;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionsListEvent(event: EventInfo) {
    switch (event.type as TransactionsListEventType) {
      case TransactionsListEventType.SHOW_FILE_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        Assertion.assertValue(event.payload.transaction.uid, 'event.payload.transaction.uid');
        this.getTransactionForPrint(event.payload.transaction.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTravelExpensesRequestEvent(event: EventInfo){
    switch (event.type as TravelExpensesRequestEventType) {
      case TravelExpensesRequestEventType.CLOSE_MODAL_CLICKED:
        this.displayTravelExpensesRequest = false;
        return;
      case TravelExpensesRequestEventType.REQUESTED:
        this.displayTravelExpensesRequest = false;
        this.resolveBudgetUpdated();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private approvePayment(dataFields: BudgetRequestFields) {
    this.submitted = true;

    this.budgetsData.approvePayment(dataFields)
      .firstValue()
      .then(x => this.resolveBudgetUpdated())
      .finally(() => this.submitted = false);
  }


  private commitBudget(dataFields: BudgetRequestFields) {
    this.submitted = true;

    this.budgetsData.commitBudget(dataFields)
      .firstValue()
      .then(x => this.resolveBudgetUpdated())
      .finally(() => this.submitted = false);
  }


  private exerciseBudget(dataFields: BudgetRequestFields) {
    this.submitted = true;

    this.budgetsData.exerciseBudget(dataFields)
      .firstValue()
      .then(x => this.resolveBudgetUpdated())
      .finally(() => this.submitted = false);
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


  private getTransactionForPrint(transactionUID: string) {
    this.isLoading = true;

    this.transactionsData.getTransactionForPrint(transactionUID)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private resolveBudgetUpdated() {
    const payload = { baseObjectUID: this.baseObjectUID };
    sendEvent(this.budgetManagementEvent, BudgetManagementEventType.UPDATED, payload);
  }


  private resolveValidateAvaibleBudget(response: BudgetValidationResult) {
    this.messageBox.show(response.result, 'Validar suficiencia')
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
