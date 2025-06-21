/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { AccountabilityDescriptor } from '@app/models';


export enum AccountabilitiesTableEventType {
  ITEM_CLICKED   = 'AccountabilitiesTableComponent.Event.ItemClicked',
  REMOVE_CLICKED = 'AccountabilitiesTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-accountabilities-table',
  templateUrl: './accountabilities-table.component.html',
})
export class AccountabilitiesTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() data: AccountabilityDescriptor[] = [];

  @Input() filter = '';

  @Input() canEdit = false;

  @Input() displayResponsible = false;

  @Input() displayCommissioner = false;

  @Output() accountabilitiesTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['roleName', 'startDate', 'endDate'];

  dataSource: TableVirtualScrollDataSource<AccountabilityDescriptor>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setDataTable();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectClicked(item: AccountabilityDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.accountabilitiesTableEvent, AccountabilitiesTableEventType.ITEM_CLICKED,
        { item });
    }
  }


  onRemoveClicked(item: AccountabilityDescriptor) {
    this.confirmRemove(item);
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.data);
  }


  private resetColumns() {
    const columns = ['roleName'];
    if (this.displayResponsible) columns.push('responsibleName');
    if (this.displayCommissioner) columns.push('commissionerName');
    columns.push('startDate', 'endDate');
    if (this.canEdit) columns.push('actionDelete');
    this.displayedColumns = [...columns];
  }



  private confirmRemove(item: AccountabilityDescriptor) {
    const title = 'Eliminar responsabilidad';
    const message = this.getConfirmRemoveAccountMessage(item);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.accountabilitiesTableEvent, AccountabilitiesTableEventType.REMOVE_CLICKED, { item })
      );
  }


  private getConfirmRemoveAccountMessage(item: AccountabilityDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Rol: </td><td><strong>${item.roleName}</strong></td></tr>
        <tr><td class='nowrap'>Área: </td><td><strong>${item.commissionerName}</strong></td></tr>
        <tr><td class='nowrap'>Responsable: </td><td><strong>${item.responsibleName}</strong></td></tr>
      </table>
      <br>¿Elimino la responsabilidad?`;
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
