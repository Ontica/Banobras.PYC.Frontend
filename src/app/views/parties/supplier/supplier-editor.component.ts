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

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { SuppliersDataService } from '@app/data-services';

import { Supplier, SupplierFields, EmptySupplier, EmptyPartyActions, PartyActions } from '@app/models';

import { SupplierHeaderComponent, SupplierHeaderEventType } from './supplier-header.component';


export enum SupplierEditorEventType {
  UPDATED = 'SupplierEditorComponent.Event.Updated',
  DELETED = 'SupplierEditorComponent.Event.Deleted',
}

@Component({
  selector: 'emp-ng-supplier-editor',
  templateUrl: './supplier-editor.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
    SupplierHeaderComponent,
  ],
})
export class SupplierEditorComponent {

  @Input() supplier: Supplier = EmptySupplier;

  @Input() actions: PartyActions = EmptyPartyActions;

  @Output() supplierEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private suppliersData: SuppliersDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.supplier);
  }


  @SkipIf('submitted')
  onSupplierHeaderEvent(event: EventInfo) {
    switch (event.type as SupplierHeaderEventType) {
      case SupplierHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateSupplier(event.payload.dataFields as SupplierFields);
        return;
      case SupplierHeaderEventType.DELETE:
        this.deleteSupplier();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateSupplier(dataFields: SupplierFields) {
    this.submitted = true;

    this.suppliersData.updateSupplier(this.supplier.uid, dataFields)
      .firstValue()
      .then(x => sendEvent(this.supplierEditorEvent, SupplierEditorEventType.UPDATED, { data: x }))
      .finally(() => this.submitted = false);
  }


  private deleteSupplier() {
    this.submitted = true;

    this.suppliersData.deleteSupplier(this.supplier.uid)
      .firstValue()
      .then(() =>
        sendEvent(this.supplierEditorEvent, SupplierEditorEventType.DELETED, { dataUID: this.supplier.uid })
      )
      .finally(() => this.submitted = false);
  }

}
