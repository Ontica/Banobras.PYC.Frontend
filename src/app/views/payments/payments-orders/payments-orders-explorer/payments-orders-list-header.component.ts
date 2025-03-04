/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { PaymentOrderDescriptor } from '@app/models';


@Component({
  selector: 'emp-pmt-payments-orders-list-header',
  templateUrl: './payments-orders-list-header.component.html',
  styleUrls: ['./payments-orders-list-item.component.scss'],
})
export class PaymentsOrdersListHeaderComponent {

  @Input() dataList: PaymentOrderDescriptor[] = [];

  @Input() selection = new SelectionModel<PaymentOrderDescriptor>(true, []);

}
