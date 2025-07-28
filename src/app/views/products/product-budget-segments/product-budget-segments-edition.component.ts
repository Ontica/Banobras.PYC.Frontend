/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { ProductsDataService } from '@app/data-services';

import { ProductBudgetSegment, EmptyProductBudgetSegment, ProductBudgetSegmentFields } from '@app/models';

import { ProductBudgetSegmentsTableEventType } from './product-budget-segments-table.component';

import { ProductBudgetSegmentEditorEventType } from './product-budget-segment-editor.component';


export enum ProductBudgetSegmentsEditionEventType {
  ITEMS_UPDATED = 'ProductBudgetSegmentsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-ng-product-budget-segments-edition',
  templateUrl: './product-budget-segments-edition.component.html',
})
export class ProductBudgetSegmentsEditionComponent {

  @Input() productUID = '';

  @Input() items: ProductBudgetSegment[] = [];

  @Input() canEdit = false;

  @Output() productBudgetSegmentsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayItemEditor = false;

  selectedItem = EmptyProductBudgetSegment;


  constructor(private productsData: ProductsDataService) { }


  onAddItemButtonClicked() {
    this.setSelectedItem(EmptyProductBudgetSegment, true);
  }


  @SkipIf('submitted')
  onProductBudgetSegmentEditorEvent(event: EventInfo) {
    switch (event.type as ProductBudgetSegmentEditorEventType) {
      case ProductBudgetSegmentEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedItem(EmptyProductBudgetSegment);
        return;
      case ProductBudgetSegmentEditorEventType.ADD_ITEM:
        Assertion.assertValue(event.payload.productUID, 'event.payload.productUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addProductBudgetSegment(event.payload.productUID,
                                     event.payload.dataFields as ProductBudgetSegmentFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onProductBudgetSegmentsTableEvent(event: EventInfo) {
    switch (event.type as ProductBudgetSegmentsTableEventType) {
      case ProductBudgetSegmentsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.removeProductBudgetSegment(this.productUID, event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private addProductBudgetSegment(productUID: string, dataFields: ProductBudgetSegmentFields) {
    this.submitted = true;

    this.productsData.addProductBudgetSegment(productUID, dataFields)
      .firstValue()
      .then(x => this.resolveProductUpdated())
      .finally(() => this.submitted = false);
  }


  private removeProductBudgetSegment(productUID: string, budgetSegmentUID: string) {
    this.submitted = true;

    this.productsData.removeProductBudgetSegment(productUID, budgetSegmentUID)
      .firstValue()
      .then(x => this.resolveProductUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveProductUpdated() {
    const payload = { productUID: this.productUID };
    sendEvent(this.productBudgetSegmentsEditionEvent, ProductBudgetSegmentsEditionEventType.ITEMS_UPDATED, payload);
    this.setSelectedItem(EmptyProductBudgetSegment);
  }


  private setSelectedItem(item: ProductBudgetSegment, display?: boolean) {
    this.selectedItem = item;
    this.displayItemEditor = display ?? !isEmpty(item);
  }

}
