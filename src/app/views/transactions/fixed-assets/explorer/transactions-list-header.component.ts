/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { FixedAssetTransactionDescriptor } from '@app/models';

@Component({
  selector: 'emp-pyc-fixed-asset-transactions-list-header',
  templateUrl: './transactions-list-header.component.html',
})
export class FixedAssetTransactionsListHeaderComponent {

  @Input() dataList: FixedAssetTransactionDescriptor[] = [];

  @Input() selection = new SelectionModel<FixedAssetTransactionDescriptor>(true, []);

}
