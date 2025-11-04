/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { BudgetTransactionsDataService } from '@app/data-services';


export enum TransactionsPlanningGeneratorEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetTransactionsPlanningGeneratorComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-bdg-transactions-planning-generator',
  templateUrl: './transactions-planning-generator.component.html',
})
export class BudgetTransactionsPlanningGeneratorComponent {

  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;

  title = 'Períodos de planeación presupuestal';


  constructor(private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onCloseButtonClicked() {
    this.closeEvent.emit();
  }


  @SkipIf('submitted')
  onSubmitButtonClicked() {
    this.bulkOperationTransactions();
  }


  private bulkOperationTransactions() {
    this.submitted = true;

    this.transactionsData.generatePlanningTransactions()
      .firstValue()
      .then(x => this.resolveGeneratePlanningTransactions(x.message))
      .finally(() => this.submitted = false);
  }


  private resolveGeneratePlanningTransactions(message: string) {
    this.messageBox.show(message, this.title);
    setTimeout(() => this.onCloseButtonClicked());
  }

}
