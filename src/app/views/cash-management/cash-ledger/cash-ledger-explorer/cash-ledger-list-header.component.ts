/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { CashLedgerDescriptor, CashLedgerQueryType } from '@app/models';

@Component({
  selector: 'emp-cf-cash-ledger-list-header',
  templateUrl: './cash-ledger-list-header.component.html',
  styleUrls: ['./cash-ledger-list-item.component.scss'],
})
export class CashLedgerListHeaderComponent {

  @Input() queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  @Input() dataList: CashLedgerDescriptor[] = [];

  @Input() selection = new SelectionModel<CashLedgerDescriptor>(true, []);

  @Input() displayControls = true;

  CashLedgerQueryType = CashLedgerQueryType;

}
