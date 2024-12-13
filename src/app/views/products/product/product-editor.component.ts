/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ProductsDataService } from '@app/data-services';

import { ProductActions, Product, ProductFields, EmptyProductActions, EmptyProduct,
         ProductHolder } from '@app/models';

import { ProductHeaderEventType } from './product-header.component';


export enum ProductEditorEventType {
  UPDATED = 'ProductEditorComponent.Event.ProductUpdated',
  DELETED = 'ProductEditorComponent.Event.ProductDeleted',
}

@Component({
  selector: 'emp-ng-product-editor',
  templateUrl: './product-editor.component.html',
})
export class ProductEditorComponent {

  @Input() product: Product = EmptyProduct;

  @Input() actions: ProductActions = EmptyProductActions;

  @Output() productEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private productData: ProductsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.product);
  }


  onProductHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ProductHeaderEventType) {
      case ProductHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateProduct(event.payload.dataFields as ProductFields);
        return;
      case ProductHeaderEventType.DELETE:
        this.deleteProduct();
        return;
      case ProductHeaderEventType.SUSPEND:
        this.suspendProduct();
        return;
      case ProductHeaderEventType.ACTIVATE:
        this.activateProduct();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateProduct(dataFields: ProductFields) {
    this.submitted = true;

    this.productData.updateProduct(this.product.uid, dataFields)
      .firstValue()
      .then(x => this.resolveProductUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteProduct() {
    this.submitted = true;

    this.productData.deleteProduct(this.product.uid)
      .firstValue()
      .then(() => this.resolveProductDeleted(this.product.uid))
      .finally(() => this.submitted = false);
  }


  private suspendProduct() {
    this.submitted = true;

    this.productData.suspendProduct(this.product.uid)
      .firstValue()
      .then(x => this.resolveProductUpdated(x))
      .finally(() => this.submitted = false);
  }


  private activateProduct() {
    this.submitted = true;

    this.productData.activateProduct(this.product.uid)
      .firstValue()
      .then(x => this.resolveProductUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveProductUpdated(data: ProductHolder) {
    const payload = { data };
    sendEvent(this.productEditorEvent, ProductEditorEventType.UPDATED, payload);
  }


  private resolveProductDeleted(productUID: string) {
    const payload = { productUID };
    sendEvent(this.productEditorEvent, ProductEditorEventType.DELETED, payload);
  }

}
