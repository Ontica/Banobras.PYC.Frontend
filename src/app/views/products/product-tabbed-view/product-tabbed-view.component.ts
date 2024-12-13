/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ProductHolder, EmptyProductHolder } from '@app/models';

import { ProductEditorEventType } from '../product/product-editor.component';


export enum ProductTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'ProductTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'ProductTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'ProductTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'ProductTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-ng-product-tabbed-view',
  templateUrl: './product-tabbed-view.component.html',
})
export class ProductTabbedViewComponent implements OnChanges {

  @Input() data: ProductHolder = EmptyProductHolder;

  @Output() productTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.productTabbedViewEvent, ProductTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onProductEditorEvent(event: EventInfo) {
    switch (event.type as ProductEditorEventType) {
      case ProductEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.productTabbedViewEvent,
          ProductTabbedViewEventType.DATA_UPDATED, {product: event.payload.data});
        return;
      case ProductEditorEventType.DELETED:
        Assertion.assertValue(event.payload.productUID, 'event.payload.productUID');
        sendEvent(this.productTabbedViewEvent,
          ProductTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const endDate = !this.data.product.endDate ?
      'N/D' : DateStringLibrary.format(this.data.product.endDate);

    const status = this.data.product.status.name === 'Eliminado' ?
      `<span class="tag tag-error tag-small">${this.data.product.status.name}</span>` :
      `<span class="tag tag-small">${this.data.product.status.name}</span>`;

    this.title = `${!this.data.product.internalCode ? '' : (this.data.product.internalCode + ': ')}
      ${this.data.product.name}` + status;

    this.hint = `<strong>${this.data.product.productCategory.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.product.productType.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${endDate}`;
  }

}
