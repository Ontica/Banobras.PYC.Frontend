/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashEntryDescriptor, CashLedgerDescriptor, CashLedgerQueryType,
         CashTransactionDescriptor } from '@app/models';


export enum CashLedgerListItemEventType {
  SELECT_CLICKED = 'CashLedgerListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'CashLedgerListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-cf-cash-ledger-list-item',
  templateUrl: './cash-ledger-list-item.component.html',
  styleUrls: ['./cash-ledger-list-item.component.scss'],
})
export class CashLedgerListItemComponent {

  @Input() queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  @Input() item: CashLedgerDescriptor;

  @Input() selected = false;

  @Input() displayControls = true;

  @Output() cashLedgerListItemEvent = new EventEmitter<EventInfo>();

  CashLedgerQueryType = CashLedgerQueryType;


  get transaction(): CashTransactionDescriptor {
    return this.item as CashTransactionDescriptor;
  }


  get entry(): CashEntryDescriptor {
    return this.item as CashEntryDescriptor;
  }


  onSelectClicked() {
    sendEvent(this.cashLedgerListItemEvent, CashLedgerListItemEventType.SELECT_CLICKED, { item: this.item });
  }


  onCheckClicked() {
    sendEvent(this.cashLedgerListItemEvent, CashLedgerListItemEventType.CHECK_CLICKED, { item: this.item });
  }

}
