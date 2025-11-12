/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { OrderHolder, EmptyOrderHolder, OrderExplorerTypeConfig, EmptyOrderExplorerTypeConfig, ObjectTypes,
         PayableOrder, ContractOrder } from '@app/models';

import { OrderEditorEventType } from '../order/order-editor.component';

import { OrderItemsEditionEventType } from '../order-items/order-items-edition.component';

import {
  BudgetManagementEventType
} from '@app/views/budgeting/budgets/budget-management/budget-management.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum OrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'OrderTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'OrderTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'OrderTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'OrderTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-ng-order-tabbed-view',
  templateUrl: './order-tabbed-view.component.html',
})
export class OrderTabbedViewComponent implements OnChanges {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() data: OrderHolder = EmptyOrderHolder;

  @Output() orderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setTitle();
    }
  }


  get showPayables(): boolean {
    return this.config.type === ObjectTypes.REQUISITION;
  }


  get orderTotal(): number {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
        return (this.data.order as PayableOrder).total ?? null;
      default:
        return null;
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onOrderEditorEvent(event: EventInfo) {
    switch (event.type as OrderEditorEventType) {
      case OrderEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.orderTabbedViewEvent,
          OrderTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case OrderEditorEventType.DELETED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        sendEvent(this.orderTabbedViewEvent,
          OrderTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderItemsEditionEvent(event: EventInfo) {
    switch (event.type as OrderItemsEditionEventType) {
      case OrderItemsEditionEventType.ITEMS_UPDATED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.REFRESH_DATA, event.payload);
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
        sendEvent(this.orderTabbedViewEvent,
          OrderTabbedViewEventType.REFRESH_DATA, { orderUID: event.payload.baseObjectUID });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { orderUID: this.data.order.uid };
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const authorizationTime = !this.data.order.authorizationTime ?
      'N/D' : DateStringLibrary.format(this.data.order.authorizationTime);

    const entityName = this.getPayableEntityName() + '&nbsp; &nbsp; | &nbsp; &nbsp;';

    const status = this.data.order.status.name === 'Eliminado' ?
      `<span class="tag tag-error tag-small">${this.data.order.status.name}</span>` :
      `<span class="tag tag-small">${this.data.order.status.name}</span>`;

    this.title = `${!this.data.order.orderNo ? '' : (this.data.order.orderNo + ': ')}
      ${this.data.order.category.name} ${status}`;

    this.hint = `<strong>${this.data.order.provider.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${entityName} ${authorizationTime}`;
  }


  private getPayableEntityName(): string {
    const isContractOrder = this.config.type === ObjectTypes.CONTRACT_ORDER;
    if (isContractOrder) {
      const order = this.data.order as ContractOrder;
      const contractNo = order?.contract?.contractNo ?? '';
      return contractNo;
    }

    return 'N/D';
  }

}
