/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { ContractDescriptor } from '@app/models';

@Component({
  selector: 'emp-pmt-contracts-list-header',
  templateUrl: './contracts-list-header.component.html',
  styleUrls: ['./contracts-list-item.component.scss'],
})
export class ContractsListHeaderComponent {

  @Input() dataList: ContractDescriptor[] = [];

  @Input() selection = new SelectionModel<ContractDescriptor>(true, []);

}
