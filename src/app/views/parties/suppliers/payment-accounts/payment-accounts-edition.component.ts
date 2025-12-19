/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { SuppliersDataService } from '@app/data-services';

import { EmptyPaymentAccount, PaymentAccount, PaymentAccountFields, SupplierHolder } from '@app/models';

import { PaymentAccountsTableEventType } from './payment-accounts-table.component';

import { PaymentAccountEditorEventType } from './payment-account-editor.component';


export enum PaymentAccountsEditionEventType {
  UPDATED = 'PaymentAccountsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-ng-payment-accounts-edition',
  templateUrl: './payment-accounts-edition.component.html',
})
export class PaymentAccountsEditionComponent {

  @Input() supplierUID = '';

  @Input() paymentAccounts: PaymentAccount[] = [];

  @Input() canEdit = false;

  @Output() paymentAccountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayPaymentAccountEditor = false;

  selectedPaymentAccount = Object.assign({}, EmptyPaymentAccount);


  constructor(private suppliersData: SuppliersDataService) { }


  onCreatePaymentAccountClicked() {
    this.setSelectedPaymentAccount(EmptyPaymentAccount, true);
  }

  @SkipIf('submitted')
  onPaymentAccountEditorEvent(event: EventInfo) {
    switch (event.type as PaymentAccountEditorEventType) {
      case PaymentAccountEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedPaymentAccount(EmptyPaymentAccount);
        return;
      case PaymentAccountEditorEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.supplierUID, 'event.payload.supplierUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createSupplierAccount(event.payload.supplierUID,
                                   event.payload.dataFields as PaymentAccountFields);
        return;
      case PaymentAccountEditorEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.supplierUID, 'event.payload.supplierUID');
        Assertion.assertValue(event.payload.paymentAccountUID, 'event.payload.paymentAccountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateSupplierAccount(event.payload.supplierUID,
                                   event.payload.paymentAccountUID,
                                   event.payload.dataFields as PaymentAccountFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onPaymentAccountsTableEvent(event: EventInfo) {
    switch (event.type as PaymentAccountsTableEventType) {
      case PaymentAccountsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.setSelectedPaymentAccount(event.payload.item);
        return;
      case PaymentAccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.deleteSupplierAccount(this.supplierUID, event.payload.item.uid)
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createSupplierAccount(supplierUID: string, dataFields: PaymentAccountFields) {
    this.submitted = true;

    this.suppliersData.createSupplierAccount(supplierUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private updateSupplierAccount(supplierUID: string, accountUID: string, dataFields: PaymentAccountFields) {
    this.submitted = true;

    this.suppliersData.updateSupplierAccount(supplierUID, accountUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteSupplierAccount(supplierUID: string, accountUID: string) {
    this.submitted = true;

    this.suppliersData.deleteSupplierAccount(supplierUID, accountUID)
      .firstValue()
      .then(x => this.resolveAccountsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private setSelectedPaymentAccount(item: PaymentAccount, display?: boolean) {
    this.selectedPaymentAccount = Object.assign({}, item);
    this.displayPaymentAccountEditor = display ?? !isEmpty(item);
  }


  private resolveAccountsUpdated(data: SupplierHolder) {
    const payload = { data };
    sendEvent(this.paymentAccountsEditionEvent, PaymentAccountsEditionEventType.UPDATED, payload);
    this.setSelectedPaymentAccount(EmptyPaymentAccount);
  }

}
