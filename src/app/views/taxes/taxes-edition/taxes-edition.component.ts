/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { TaxesDataService } from '@app/data-services';

import { TaxEntry, TaxEntryFields } from '@app/models';

import { TaxAssignerEventType } from './tax-assigner.component';

import { TaxesTableEventType } from './taxes-table.component';


export enum TaxesEditionEventType {
  CLOSE_BUTTON_CLICKED = 'TaxesEditionComponent.Event.CloseButtonClicked',
  UPDATED              = 'TaxesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-financial-taxes-edition',
  templateUrl: './taxes-edition.component.html',
})
export class TaxesEditionComponent {

  @Input() orderUID = null;

  @Input() taxes: TaxEntry[] = [];

  @Input() canEdit = false;

  @Output() taxesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private taxesData: TaxesDataService) { }


  onCloseButtonClicked() {
    sendEvent(this.taxesEditionEvent, TaxesEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  @SkipIf('submitted')
  onTaxAssignerEvent(event: EventInfo) {
    switch (event.type as TaxAssignerEventType) {
      case TaxAssignerEventType.ASSIGN_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addTaxEntry(event.payload.orderUID,
                         event.payload.dataFields as TaxEntryFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onTaxesTableEventType(event: EventInfo) {
    switch (event.type as TaxesTableEventType) {
      case TaxesTableEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.taxEntryUID, 'event.payload.taxEntryUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateTaxEntry(event.payload.orderUID,
                            event.payload.taxEntryUID,
                            event.payload.dataFields as TaxEntryFields);
        return;

      case TaxesTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.taxEntryUID, 'event.payload.taxEntryUID');
        this.removeTaxEntry(event.payload.orderUID,
                            event.payload.taxEntryUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private addTaxEntry(orderUID: string, dataFields: TaxEntryFields) {
    this.submitted = true;

    this.taxesData.addTaxEntry(orderUID, dataFields)
      .firstValue()
      .then(x => this.resolveTaxUpdated(orderUID))
      .finally(() => this.submitted = false);
  }


  private updateTaxEntry(orderUID: string, taxEntryUID: string, dataFields: TaxEntryFields) {
    this.submitted = true;

    this.taxesData.updateTaxEntry(orderUID, taxEntryUID, dataFields)
      .firstValue()
      .then(x => this.resolveTaxUpdated(orderUID))
      .finally(() => this.submitted = false);
  }


  private removeTaxEntry(orderUID: string, taxEntryUID: string) {
    this.submitted = true;

    this.taxesData.removeTaxEntry(orderUID, taxEntryUID)
      .firstValue()
      .then(x => this.resolveTaxUpdated(orderUID))
      .finally(() => this.submitted = false);
  }


  private resolveTaxUpdated(orderUID: string) {
    sendEvent(this.taxesEditionEvent, TaxesEditionEventType.UPDATED, { orderUID });
  }

}
