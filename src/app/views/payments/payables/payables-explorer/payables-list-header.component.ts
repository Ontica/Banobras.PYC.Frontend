/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { PayableDescriptor } from '@app/models';


@Component({
  selector: 'emp-pmt-payables-list-header',
  templateUrl: './payables-list-header.component.html',
  styleUrls: ['./payables-list-item.component.scss'],
})
export class PayablesListHeaderComponent {

  @Input() dataList: PayableDescriptor[] = [];

  @Input() selection = new SelectionModel<PayableDescriptor>(true, []);

}
