/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

import { SecurityItem } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { SecurityItemAssignEventType } from './security-item-assign.component';

export enum SecurityItemEditionEventType {
  SELECTOR_CHANGED = 'SecurityItemEditionComponent.Event.SelectorChanged',
  ASSIGN_ITEM      = 'SecurityItemEditionComponent.Event.AssignItem',
  REMOVE_ITEM      = 'SecurityItemEditionComponent.Event.RemoveItem',
}

@Component({
  selector: 'emp-ng-security-item-edition',
  templateUrl: './security-item-edition.component.html',
})
export class SecurityItemEditionComponent implements OnChanges {

  @Input() itemsAssignedList: Identifiable[] = [];

  @Input() itemsForSelectorList: Identifiable[] = [];

  @Input() itemsToAssignList: SecurityItem[] = [];

  @Input() canEdit = false;

  @Input() selectorRequired = false;

  @Input() itemTypeName: string = '';

  @Input() queryExcecuted = true;

  @Input() submitted = false;

  @Output() securityItemEditionEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['item'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Identifiable>;

  selectedSelectorUID = null;

  displayItemAssign = false;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.itemsAssignedList) {
      this.setDataTable();
      this.closeItemToAssign();
    }

    if (changes.itemsToAssignList || changes.itemsForSelectorList) {
      this.resetSelectedSelectorIfNotInList();
    }

    if (changes.queryExcecuted) {
      this.resetSelectorIfNotQueryExecuted();
    }
  }


  get isSelectorValid(): boolean {
    return this.selectorRequired ? !!this.selectedSelectorUID : true;
  }


  onSelectedSelectorChanges(selector: Identifiable) {
    const payload = {
      selectorUID: selector.uid ?? '',
    };

    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.SELECTOR_CHANGED, payload);
  }


  onAssignItemButtonClicked() {
    this.displayItemAssign = true;
  }


  onSecurityItemAssignEvent(event: EventInfo) {
    switch (event.type as SecurityItemAssignEventType) {
      case SecurityItemAssignEventType.ASSIGN_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.emitEventType(SecurityItemEditionEventType.ASSIGN_ITEM, event.payload.itemUID);
        return;

      case SecurityItemAssignEventType.CLOSE_MODAL_CLICKED:
        this.closeItemToAssign();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRemoveItemClicked(item: Identifiable) {
    this.showConfirmMessage(item);
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.itemsAssignedList);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private resetSelectorIfNotQueryExecuted() {
    if (!this.queryExcecuted) {
      this.selectedSelectorUID = null;
    }
  }


  private resetSelectedSelectorIfNotInList() {
    if (!!this.selectedSelectorUID &&
        !this.itemsForSelectorList.map(x => x.uid).includes(this.selectedSelectorUID)) {
      this.selectedSelectorUID = null;
      setTimeout(() => this.onSelectedSelectorChanges(Empty));
    }
  }


  private closeItemToAssign() {
    this.displayItemAssign = false;
  }


  private showConfirmMessage(item: Identifiable) {
    const title = `Eliminar ${this.itemTypeName.toLowerCase()}`;
    const message = `Esta operación eliminara de la cuenta el elemento
      <strong> ${this.itemTypeName}: ${item.name}</strong>.
      <br><br>¿Elimino el elemento?`;

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          this.emitEventType(SecurityItemEditionEventType.REMOVE_ITEM, item.uid);
        }
      });
  }


  private emitEventType(eventType: SecurityItemEditionEventType, itemUID: string) {
    const payload = {
      selectorUID: this.selectedSelectorUID ?? '',
      itemUID: itemUID,
    };

    sendEvent(this.securityItemEditionEvent, eventType, payload);
  }

}
