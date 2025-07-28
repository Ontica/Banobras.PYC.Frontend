/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { ProductsDataService } from '@app/data-services';

import { ProductFields } from '@app/models';

import { ProductHeaderEventType } from './product-header.component';


export enum ProductCreatorEventType {
  CLOSE_MODAL_CLICKED = 'ProductCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'ProductCreatorComponent.Event.ProductCreated',
}

@Component({
  selector: 'emp-ng-product-creator',
  templateUrl: './product-creator.component.html',
})
export class ProductCreatorComponent {

  @Output() productCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private productData: ProductsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.productCreatorEvent, ProductCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onProductHeaderEvent(event: EventInfo) {
    switch (event.type as ProductHeaderEventType) {
      case ProductHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createProduct(event.payload.dataFields as ProductFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createProduct(dataFields: ProductFields) {
    this.submitted = true;

    this.productData.createProduct(dataFields)
      .firstValue()
      .then(x => sendEvent(this.productCreatorEvent, ProductCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
