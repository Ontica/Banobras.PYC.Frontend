/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { BudgetPeriodControlDataService } from '@app/data-services';

import { Budget, BudgetPeriod, BudgetPeriodResult, BudgetSelector } from '@app/models';

import { BudgetSelectorEventType } from './budget-selector.component';

import { BudgetPeriodTableEventType } from './budget-period-table.component';


export enum BudgetPeriodControlEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetPeriodControlComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-bdg-budget-period-control',
  templateUrl: './budget-period-control.component.html',
})
export class BudgetPeriodControlComponent {

  @Output() closeEvent = new EventEmitter<void>();

  data: BudgetPeriod[] = [];

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  title = 'Control de períodos presupuestales';

  query: BudgetSelector = Object.assign({});

  budget: Budget = null;


  constructor(private budgetPeriodControlData: BudgetPeriodControlDataService,
              private messageBox: MessageBoxService) { }


  get budgetName(): string {
    return isEmpty(this.budget) ? '' : ` (${this.budget.name})`;
  }


  @SkipIf('submitted')
  onCloseButtonClicked() {
    this.closeEvent.emit();
  }


  @SkipIf('submitted')
  onBudgetSelectorEvent(event: EventInfo) {
    switch (event.type as BudgetSelectorEventType) {
      case BudgetSelectorEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.budget, 'event.payload.budget');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.query.budgetUID, 'event.payload.query.budgetUID');
        this.setQueryAndClearData(event.payload.budget as Budget, event.payload.query as BudgetSelector);
        this.getBudgetPeriods(this.query.budgetUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onBudgetPeriodTableEvent(event: EventInfo) {
    switch (event.type as BudgetPeriodTableEventType) {
      case BudgetPeriodTableEventType.CLOSE_CLICKED:
        Assertion.assertValue(event.payload.data.month, 'event.payload.data.month');
        this.closeBudgetPeriod(this.query.budgetUID, event.payload.data.month);
        return;
      case BudgetPeriodTableEventType.OPEN_CLICKED:
        Assertion.assertValue(event.payload.data.month, 'event.payload.data.month');
        this.openBudgetPeriod(this.query.budgetUID, event.payload.data.month);
        return;
      case BudgetPeriodTableEventType.GENERATE_CLICKED:
        Assertion.assertValue(event.payload.data.month, 'event.payload.data.month');
        this.generateBalanceTransferTransactions(this.query.budgetUID, event.payload.data.month);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getBudgetPeriods(budgetUID: string) {
    this.isLoading = true;

    this.budgetPeriodControlData.getBudgetPeriods(budgetUID)
      .firstValue()
      .then(x => this.setData(x))
      .finally(() => this.isLoading = false);
  }


  private closeBudgetPeriod(budgetUID: string, month: number) {
    this.submitted = true;

    this.budgetPeriodControlData.closeBudgetMonth(budgetUID, month)
      .firstValue()
      .then(x => this.resolveBudgetPeriodResult(x))
      .finally(() => this.submitted = false);
  }


  private openBudgetPeriod(budgetUID: string, month: number) {
    this.submitted = true;

    this.budgetPeriodControlData.openBudgetMonth(budgetUID, month)
      .firstValue()
      .then(x => this.resolveBudgetPeriodResult(x))
      .finally(() => this.submitted = false);
  }


  private generateBalanceTransferTransactions(budgetUID: string, month: number) {
    this.submitted = true;

    this.budgetPeriodControlData.generateBalanceTransferTransactions(budgetUID, month)
      .firstValue()
      .then(x => this.resolveBudgetPeriodResult(x))
      .finally(() => this.submitted = false);
  }


  private resolveBudgetPeriodResult(result: BudgetPeriodResult, ) {
    this.messageBox.show(result.message, this.title);
    this.getBudgetPeriods(this.query.budgetUID);
    this.setData([]);
  }


  private setQueryAndClearData(budget: Budget, query: BudgetSelector) {
    this.budget = isEmpty(budget) ? null : budget;
    this.query = Object.assign({}, query);
    this.setData([], false);
  }


  private setData(data: BudgetPeriod[], queryExecuted: boolean = true) {
    this.data = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
