/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { CashFlowProjectionDescriptor } from '@app/models';

@Component({
  selector: 'emp-cf-projections-list-header',
  templateUrl: './projections-list-header.component.html',
  styleUrls: ['./projections-list-item.component.scss'],
})
export class CashFlowProjectionsListHeaderComponent {

  @Input() dataList: CashFlowProjectionDescriptor[] = [];

  @Input() selection = new SelectionModel<CashFlowProjectionDescriptor>(true, []);

  @Input() displayControls = true;

}
