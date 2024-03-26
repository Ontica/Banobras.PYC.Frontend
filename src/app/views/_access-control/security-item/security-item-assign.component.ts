/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { SecurityItem } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum SecurityItemAssignEventType {
  CLOSE_MODAL_CLICKED = 'SecurityItemAssignComponent.Event.CloseModalClicked',
  ASSIGN_ITEM         = 'SecurityItemAssignComponent.Event.AssignItem',
}

@Component({
  selector: 'emp-ng-security-item-assign',
  styles: [`
    .items-scroll-container {
      max-height: 100%;
      overflow-y: auto;
      margin-right: 8px;
    }

    @media (min-height: 800px) {
      .items-scroll-container {
        max-height: 580px;
      }
    }

    .radio-list {
      width: 100%;
    }

    .radio-list-item {
      padding: 8px;
      width: 100%
    }

    .radio-list-item-container {
      padding-left: 16px;
    }

    .radio-list-item-description {
      font-size: 10px;
      font-weight: 500;
      line-height: 1rem;
      padding-top: 8px;
      white-space: normal;
    }
  `],
  templateUrl: './security-item-assign.component.html',
})
export class SecurityItemAssignComponent implements OnInit {

  @Input() itemsAssignedList: Identifiable[] = [];

  @Input() itemsToAssignList: SecurityItem[] = [];

  @Input() itemTypeName: string = '';

  @Input() submitted = false;

  @Output() securityItemAssignEvent = new EventEmitter<EventInfo>();

  itemToAssign = Empty;

  itemsToAssignFilteredList: SecurityItem[] = [];

  hasGroups = false;

  groupsList: string[] = []

  selectedGroup = null;

  groupForAllName = 'Todos';


  ngOnInit() {
    this.validateGroupsData();
    this.setItemsToAssignFiltered();
  }


  get isItemToAssignValid(): boolean {
    return !isEmpty(this.itemToAssign);
  }


  onCloseItemAssign() {
    sendEvent(this.securityItemAssignEvent, SecurityItemAssignEventType.CLOSE_MODAL_CLICKED);
  }


  onSelectedGroupChanges() {
    this.itemToAssign = Empty;
    this.setItemsToAssignFiltered();
  }


  onAssignItem() {
    const payload = {
      itemUID: this.itemToAssign.uid,
    };

    sendEvent(this.securityItemAssignEvent, SecurityItemAssignEventType.ASSIGN_ITEM, payload);
  }


  private validateGroupsData() {
    this.hasGroups = this.itemsToAssignList.some(x => !!x.group);
    this.selectedGroup = null;

    if (this.hasGroups) {
      const allGroups: string[] = this.itemsToAssignList.map(x => x.group);
      this.groupsList =
        [...[this.groupForAllName], ...allGroups.filter((x, i) => allGroups.indexOf(x) === i)];
      return;
    }

    this.groupsList = [];
  }


  private setItemsToAssignFiltered() {
    const itemsValidList =
      this.itemsToAssignList.filter(x => !this.itemsAssignedList.map(y => y.uid).includes(x.uid));

    if (this.hasGroups) {
      this.itemsToAssignFilteredList = this.selectedGroup === this.groupForAllName ?
        itemsValidList : itemsValidList.filter(x => x.group === this.selectedGroup);
    } else {
      this.itemsToAssignFilteredList = itemsValidList;
    }
  }

}
