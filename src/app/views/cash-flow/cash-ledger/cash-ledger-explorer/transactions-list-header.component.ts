/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { CashTransactionDescriptor } from '@app/models';

@Component({
  selector: 'emp-cf-transactions-list-header',
  templateUrl: './transactions-list-header.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class CashTransactionsListHeaderComponent {

  @Input() dataList: CashTransactionDescriptor[] = [];

  @Input() selection = new SelectionModel<CashTransactionDescriptor>(true, []);

  @Input() displayControls = true;

}
