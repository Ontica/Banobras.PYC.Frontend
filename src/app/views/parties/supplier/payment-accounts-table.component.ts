/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { PaymentAccount } from '@app/models';


export enum PaymentAccountsTableEventType {
  REMOVE_CLICKED = 'PaymentAccountsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-payment-accounts-table',
  templateUrl: './payment-accounts-table.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
  ],
})
export class PaymentAccountsTableComponent implements OnChanges {

  @Input() paymentAccounts: PaymentAccount[] = [];

  @Input() canEdit = false;

  @Output() paymentAccountsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['accountType', 'institution', 'accountNo', 'referenceNumber',
                                       'holderName', 'currency'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PaymentAccount>;


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentAccounts) {
      this.setDataTable();
    }
  }


  onRemoveClicked(paymentAccount: PaymentAccount) {
    const message = this.getConfirmMessage(paymentAccount);

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.paymentAccountsTableEvent, PaymentAccountsTableEventType.REMOVE_CLICKED, {paymentAccount})
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.paymentAccounts);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(paymentAccount: PaymentAccount): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Cuenta: </td><td><strong>${paymentAccount.name}</strong></td></tr>
        <tr><td class='nowrap'>Número: </td><td><strong>${paymentAccount.accountNo}</strong></td></tr>
        <tr><td class='nowrap'>Método de pago: </td><td><strong>${paymentAccount.paymentMethod}</strong></td></tr>
        <tr><td class='nowrap'>Moneda: </td><td><strong>${paymentAccount.currency}</strong></td></tr>
      </table>

     <br>¿Elimino la cuenta?`;
  }

}
