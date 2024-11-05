/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, Input } from '@angular/core';

import { RequestDescriptor } from '@app/models';

@Component({
  selector: 'emp-pyc-requests-list-header',
  templateUrl: './requests-list-header.component.html',
  styleUrls: ['./requests-list-item.component.scss'],
})
export class RequestsListHeaderComponent {

  @Input() dataList: RequestDescriptor[] = [];

  @Input() selection = new SelectionModel<RequestDescriptor>(true, []);

}
