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

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { SuppliersDataService } from '@app/data-services';

import { SupplierFields } from '@app/models';

import { SupplierHeaderComponent, SupplierHeaderEventType } from './supplier-header.component';


export enum SupplierCreatorEventType {
  CLOSE_MODAL_CLICKED = 'SupplierCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'SupplierCreatorComponent.Event.Created',
}

@Component({
  selector: 'emp-ng-supplier-creator',
  templateUrl: './supplier-creator.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
    SupplierHeaderComponent,
  ],
})
export class SupplierCreatorComponent {

  @Output() supplierCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private suppliersData: SuppliersDataService) { }


  onCloseModalClicked() {
    sendEvent(this.supplierCreatorEvent, SupplierCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onSupplierHeaderEvent(event: EventInfo) {
    switch (event.type as SupplierHeaderEventType) {
      case SupplierHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createSupplier(event.payload.dataFields as SupplierFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createSupplier(dataFields: SupplierFields) {
    this.submitted = true;

    this.suppliersData.createSupplier(dataFields)
      .firstValue()
      .then(x => sendEvent(this.supplierCreatorEvent, SupplierCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
