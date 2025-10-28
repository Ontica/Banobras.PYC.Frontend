/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ExplorerDisplayedData, FinancialAccountDescriptor } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { AccountsListItemEventType } from './accounts-list-item.component';


export enum AccountsListEventType {
  DISPLAYED_DATA = 'FinancialAccountsListComponent.Event.DisplayedData',
  SELECT_CLICKED = 'FinancialAccountsListComponent.Event.SelectClicked',
  EXPORT_CLICKED = 'FinancialAccountsListComponent.Event.ExportClicked',
}

@Component({
  selector: 'emp-financial-accounts-list',
  templateUrl: './accounts-list.component.html',
})
export class FinancialAccountsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: FinancialAccountDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() accountsListEvent = new EventEmitter<EventInfo>();

  filteredDataList: FinancialAccountDescriptor[] = [];

  filter = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.filter = '';
      this.setFilteredDataList();
      this.scrollToTop();
    }
  }


  get noDataMessage(): string {
    if (this.isLoading) return 'Cargando...';
    if (!this.queryExecuted) return 'No se ha invocado la búsqueda.';
    if (this.dataList.length === 0) return 'No se encontraron registros con el filtro proporcionado.';
    if (this.filteredDataList.length === 0) return 'No se encontraron coincidencias con el texto ingresado.';
    return '';
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter ?? '';
        this.setFilteredDataList();
        this.emitDesplayedData();
        return;
      case ListControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.accountsListEvent, AccountsListEventType.EXPORT_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsListItemEvent(event: EventInfo) {
    switch (event.type as AccountsListItemEventType) {
      case AccountsListItemEventType.SELECT_CLICKED:
        sendEvent(this.accountsListEvent, AccountsListEventType.SELECT_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setFilteredDataList() {
    this.filteredDataList = this.getFilteredData();

  }


  private getFilteredData(): FinancialAccountDescriptor[] {
    if (!this.dataList) return [];
    if (!this.filter) return this.dataList;

    const normalizedFilter = this.filter.trim().toLowerCase();

    return this.dataList.filter(item => {
      const values = Object.values(item);

      return values.some(value =>
        String(value ?? '').toLowerCase().includes(normalizedFilter)
      );
    });
  }


  private emitDesplayedData() {
    const payload: ExplorerDisplayedData = {
      displayedCount: this.filteredDataList.length,
      totalCount: this.dataList.length,
    };

    sendEvent(this.accountsListEvent, AccountsListEventType.DISPLAYED_DATA, payload);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
