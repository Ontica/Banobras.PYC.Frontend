/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { PaymentInstructionDescriptor } from '@app/models';


@Component({
  selector: 'emp-pmt-payment-instructions-list-header',
  templateUrl: './payment-instructions-list-header.component.html',
  styleUrls: ['./payment-instructions-list-item.component.scss'],
})
export class PaymentInstructionsListHeaderComponent {

  @Input() dataList: PaymentInstructionDescriptor[] = [];

  @Input() selection = new SelectionModel<PaymentInstructionDescriptor>(true, []);

  @Input() displayControls = true;

}
