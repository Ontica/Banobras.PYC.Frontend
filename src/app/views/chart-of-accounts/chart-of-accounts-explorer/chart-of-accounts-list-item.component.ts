/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { StandardAccountDescriptor } from '@app/models';


export enum ChartOfAccountsListItemEventType {
  SELECT_CLICKED = 'ChartOfAccountsListItemComponent.Event.SelectClicked',
}


@Component({
  selector: 'emp-cf-chart-of-accounts-list-item',
  templateUrl: './chart-of-accounts-list-item.component.html',
  styleUrls: ['./chart-of-accounts-list-item.component.scss'],
})
export class ChartOfAccountsListItemComponent {

  @Input() item: StandardAccountDescriptor;

  @Input() maxLevel = 6;

  @Output() chartOfAccountsListItemEvent = new EventEmitter<EventInfo>();

  levelWidth = 20;


  onSelectClicked() {
    sendEvent(this.chartOfAccountsListItemEvent, ChartOfAccountsListItemEventType.SELECT_CLICKED,
      { item: this.item });
  }


  get widthByMaxLevel() {
    return (this.maxLevel >= 5 ? this.levelWidth * this.maxLevel : (this.levelWidth * 5)) + 8;
  }


  get marginLeftByLevel() {
    if (this.item.level >= 3) {
      return this.item.level * 8 - 8;
    }

    return 0;
  }

}
