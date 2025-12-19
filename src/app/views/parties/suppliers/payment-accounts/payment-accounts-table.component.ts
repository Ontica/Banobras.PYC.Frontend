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

import { PaymentAccount } from '@app/models';


export enum PaymentAccountsTableEventType {
  SELECT_CLICKED = 'PaymentAccountsTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'PaymentAccountsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-payment-accounts-table',
  templateUrl: './payment-accounts-table.component.html',
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


  onSelectAccountClicked(item: PaymentAccount) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.paymentAccountsTableEvent, PaymentAccountsTableEventType.SELECT_CLICKED, { item });
    }
  }


  onRemoveClicked(item: PaymentAccount) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.paymentAccountsTableEvent, PaymentAccountsTableEventType.REMOVE_CLICKED, { item })
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


  private getConfirmMessage(item: PaymentAccount): string {
    return `Esta operación eliminará la cuenta:<br><br>
      <table class='confirm-data'>
        <tr><td class='nowrap'>Tipo: </td><td><strong>${item.accountType.name}</strong></td></tr>
        <tr><td class='nowrap'>Institución: </td><td><strong>${item.institution.name}</strong></td></tr>
        <tr><td class='nowrap'>No. cuenta: </td><td><strong>${item.accountNo}</strong></td></tr>
        <tr><td class='nowrap'>Beneficiario: </td><td><strong>${item.holderName}</strong></td></tr>
      </table>
     <br>¿Elimino la cuenta?`;
  }

}
