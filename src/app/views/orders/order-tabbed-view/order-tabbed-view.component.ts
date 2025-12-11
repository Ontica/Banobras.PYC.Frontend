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
         ContractOrder } from '@app/models';

import { OrderEditorEventType } from '../order/order-editor.component';

import { OrderItemsEditionEventType } from '../order-items/order-items-edition.component';

import { BillsEditionEventType } from '@app/views/billing/bills-edition/bills-edition.component';

import {
  BudgetManagementEventType
} from '@app/views/budgeting/budgets/budget-management/budget-management.component';

import {
  PaymentsOrdersEditionEventType
} from '@app/views/payments/payments-orders/payments-orders-edition/payments-orders-edition.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


interface TabConfig {
  label: string;
  tab: TabType;
}

enum TabType {
  order              = 'order',
  items              = 'items',
  budgetTransactions = 'budgetTransactions',
  orders             = 'orders',
  bills              = 'bills',
  paymentOrders      = 'paymentOrders',
  documents          = 'documents',
  history            = 'history',
}


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

  tabs: TabConfig[] = [];

  TabType = TabType;

  selectedTabIndex = 0;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.config) {
      this.setTabs();
    }

    if (changes.data) {
      this.setTitle();
    }
  }


  get isRequisition(): boolean {
    return [ObjectTypes.REQUISITION].includes(this.config.type);
  }


  get isContract(): boolean {
    return [ObjectTypes.CONTRACT].includes(this.config.type);
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
      case OrderItemsEditionEventType.TAXES_UPDATED:
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


  onBillsEditionEvent(event: EventInfo) {
    switch (event.type as BillsEditionEventType) {
      case BillsEditionEventType.UPDATED:
        const payload = { orderUID: this.data.order.uid };
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentsOrdersEditionEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersEditionEventType) {
      case PaymentsOrdersEditionEventType.UPDATED:
        const payload = { orderUID: this.data.order.uid };
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.REFRESH_DATA, payload);
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
      const contractNo = order?.contract?.orderNo ?? '';
      return contractNo;
    }

    return 'N/D';
  }


  private setTabs() {
    const orderTypeName = this.config.nameSingular;
    const ordersName = this.config.type === ObjectTypes.CONTRACT ? 'Entregas' : 'Adquisiciones';

    const baseTabs: TabConfig[] = [
      { label: orderTypeName,   tab: TabType.order },
      { label: 'Conceptos',     tab: TabType.items },
      { label: 'Presupuesto',   tab: TabType.budgetTransactions },
      { label: ordersName,      tab: TabType.orders },
      { label: 'Comprobantes',  tab: TabType.bills },
      { label: 'Pagos',         tab: TabType.paymentOrders },
      { label: 'Documentos',    tab: TabType.documents },
      { label: 'Historial',     tab: TabType.history },
    ];

    switch (this.config.type) {
      case ObjectTypes.REQUISITION:
      case ObjectTypes.CONTRACT:
        this.tabs = baseTabs;
        break;
      case ObjectTypes.EXPENSE:
        this.tabs = [
          baseTabs[0],
          baseTabs[4],
          baseTabs[1],
          baseTabs[5],
          baseTabs[2],
          baseTabs[6],
          baseTabs[7],
        ];
        break;
      case ObjectTypes.CONTRACT_ORDER:
      case ObjectTypes.PURCHASE:
      default:
        this.tabs = baseTabs.filter(t => t.tab !== TabType.orders);
        break;
    }
  }

}
