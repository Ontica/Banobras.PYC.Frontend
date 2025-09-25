/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { MessageBoxService } from '@app/shared/services';

import { EmptyImportBudgetTransactionsResult, ImportBudgetTransactionsResult,
         ImportBudgetTransactionsTotals } from '@app/models';


@Component({
  selector: 'emp-bdg-transactions-importer-details-table',
  templateUrl: './importer-details-table.component.html',
})
export class BudgetTransactionsImporterDetailsTableComponent implements OnChanges {

  @Input() importResult: ImportBudgetTransactionsResult = EmptyImportBudgetTransactionsResult;

  @Input() commandExecuted = false;

  displayedColumns = ['description', 'transactionsCount', 'errorsCount', 'warningsCount'];

  dataSource: MatTableDataSource<ImportBudgetTransactionsTotals>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.importResult) {
      this.dataSource = new MatTableDataSource(this.importResult?.transactionTotals || []);
    }
  }


  onShowErrorsClicked(row: ImportBudgetTransactionsTotals) {
    const errorsList = this.importResult.errors.filter(x => x.uid === row.uid).map(x => x.name);
    this.showMessage('Errores detectados', row.description, errorsList);
  }


  onShowWarningsClicked(row: ImportBudgetTransactionsTotals) {
    const warningsList = this.importResult.warnings.filter(x => x.uid === row.uid).map(x => x.name);
    this.showMessage('Advertencias detectadas', row.description, warningsList);
  }


  private showMessage(title: string, description: string, messageList: string[]) {
    if (messageList.length > 0) {
      let message = `<strong>${description}:</strong> <br><br> `;
      message += '<ul class="info-list">' +
        messageList.map(x => '<li>' + x + '</li>').join('') + '</ul>';
      this.messageBox.show(message, title);
    }
  }

}
