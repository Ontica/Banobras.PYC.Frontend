/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'emp-cf-chart-of-accounts-list-header',
  templateUrl: './chart-of-accounts-list-header.component.html',
  styleUrls: ['./chart-of-accounts-list-item.component.scss'],
})
export class ChartOfAccountsListHeaderComponent {

  @Input() maxLevel = 7;


  get widthByMaxLevel() {
    return (this.maxLevel >= 5 ? 22 * this.maxLevel : 110) + 8;
  }

}
