/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { BudgetTransactionDescriptor } from '@app/models';

@Component({
  selector: 'emp-bdg-transactions-list-header',
  templateUrl: './transactions-list-header.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class BudgetTransactionsListHeaderComponent {

  @Input() dataList: BudgetTransactionDescriptor[] = [];

  @Input() selection = new SelectionModel<BudgetTransactionDescriptor>(true, []);

}
