/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { ObjectTypes, ContractData, EmptyContractData } from '@app/models';

import { ContractEditorEventType } from '../contract/contract-editor.component';

import { ContractItemsEditionEventType } from '../contract-items/contract-items-edition.component';

import {
  BudgetManagementEventType
} from '@app/views/budgeting/budgets/budget-management/budget-management.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum ContractTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'ContractTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'ContractTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'ContractTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'ContractTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pmt-contract-tabbed-view',
  templateUrl: './contract-tabbed-view.component.html',
})
export class ContractTabbedViewComponent implements OnChanges {

  @Input() data: ContractData = EmptyContractData;

  @Output() contractTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  status = '';

  selectedTabIndex = 0;

  objectType = ObjectTypes.CONTRACT;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.contractTabbedViewEvent, ContractTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onContractEditorEvent(event: EventInfo) {
    switch (event.type as ContractEditorEventType) {
      case ContractEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.contractData, 'event.payload.contractData');
        sendEvent(this.contractTabbedViewEvent,
          ContractTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case ContractEditorEventType.DELETED:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        sendEvent(this.contractTabbedViewEvent,
          ContractTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onContractItemsEditionEvent(event: EventInfo) {
    switch (event.type as ContractItemsEditionEventType) {
      case ContractItemsEditionEventType.ITEMS_UPDATED:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        sendEvent(this.contractTabbedViewEvent, ContractTabbedViewEventType.REFRESH_DATA, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBudgetManagementEvent(event: EventInfo) {
    switch (event.type as BudgetManagementEventType) {
      case BudgetManagementEventType.UPDATED:
        Assertion.assertValue(event.payload.baseObjectUID, 'event.payload.baseObjectUID');
        sendEvent(this.contractTabbedViewEvent,
          ContractTabbedViewEventType.REFRESH_DATA, { contractUID: event.payload.baseObjectUID });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { contractUID: this.data.contract.uid };
        sendEvent(this.contractTabbedViewEvent, ContractTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const signDate = !this.data.contract.signDate ?
      'N/D' : DateStringLibrary.format(this.data.contract.signDate);

    const total = FormatLibrary.numberWithCommas(this.data.contract.total, '1.2-2');

    const type = this.data.contract.budgets.length > 1 ? 'Plurianual' : 'Anual';

    this.title = `${!this.data.contract.contractNo ? '' : (this.data.contract.contractNo + ': ')}
      ${this.data.contract.name}`;

    this.status = this.data.contract.status.name === 'Eliminado' ?
      `<span class="tag tag-error tag-small">${this.data.contract.status.name}</span>` :
      `<span class="tag tag-small">${this.data.contract.status.name}</span>`;

    this.hint = `<strong>${this.data.contract.contractType.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.contract.supplier.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${type} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${signDate} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${total}`;
  }

}
