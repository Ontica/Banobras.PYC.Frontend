/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountHolder, EmptyFinancialAccountHolder } from '@app/models';

import { OperationsEditionEventType } from '../operations/operations-edition.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum AccountTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialAccountTabbedViewComponent.Event.CloseButtonClicked',
  REFRESH_DATA         = 'FinancialAccountTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-financial-account-tabbed-view',
  templateUrl: './account-tabbed-view.component.html',
})
export class FinancialAccountTabbedViewComponent implements OnChanges {

  @Input() data: FinancialAccountHolder = EmptyFinancialAccountHolder;

  @Output() accountTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.accountTabbedViewEvent, AccountTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onOperationsEditionEvent(event: EventInfo) {
    switch (event.type as OperationsEditionEventType) {
      case OperationsEditionEventType.UPDATED:
        this.emitRefreshData();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        this.emitRefreshData();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const status = this.data.account.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.account.status.name}</span>` :
      `<span class="tag tag-small">${this.data.account.status.name}</span>`;

    this.title = `${this.data.account.accountNo}: ${this.data.account.description} ${status}`;

    this.hint = `<strong>${this.data.account.financialAccountType.name}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.account.organizationalUnit?.name}`;
  }


  private emitRefreshData() {
    const payload = { dataUID: this.data.account.uid };
    sendEvent(this.accountTabbedViewEvent, AccountTabbedViewEventType.REFRESH_DATA, payload);
  }

}
