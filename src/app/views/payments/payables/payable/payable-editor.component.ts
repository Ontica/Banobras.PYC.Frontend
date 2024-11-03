/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PayablesDataService } from '@app/data-services';

import { EmptyPayable, EmptyPayableActions, EmptyPayableEntity, Payable, PayableActions, PayableData,
         PayableEntity, PayableFields } from '@app/models';

import { PayableHeaderEventType } from './payable-header.component';


export enum PayableEditorEventType {
  PAYABLE_UPDATED = 'PayableEditorComponent.Event.PayableUpdated',
  PAYABLE_DELETED = 'PayableEditorComponent.Event.PayableDeleted',
}

@Component({
  selector: 'emp-pmt-payable-editor',
  templateUrl: './payable-editor.component.html',
})
export class PayableEditorComponent {

  @Input() payable: Payable = EmptyPayable;

  @Input() payableEntity: PayableEntity = EmptyPayableEntity;

  @Input() actions: PayableActions = EmptyPayableActions;

  @Output() payableEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private payableData: PayablesDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.payable);
  }


  onPayableHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as PayableHeaderEventType) {
      case PayableHeaderEventType.UPDATE_PAYABLE:
        Assertion.assertValue(event.payload.payableFields, 'event.payload.payableFields');
        this.updatePayable(this.payable.uid, event.payload.payableFields as PayableFields);
        return;
      case PayableHeaderEventType.DELETE_PAYABLE:
        this.deletePayable(this.payable.uid);
        return;
      case PayableHeaderEventType.GENERATE_PAYMENT_ORDER:
        this.generatePaymentOrder(this.payable.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updatePayable(payableUID: string, payableFields: PayableFields) {
    this.submitted = true;

    this.payableData.updatePayable(payableUID, payableFields)
      .firstValue()
      .then(x => this.resolvePayableUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deletePayable(payableUID: string) {
    this.submitted = true;

    this.payableData.deletePayable(payableUID)
      .firstValue()
      .then(() => this.resolvePayableDeleted(payableUID))
      .finally(() => this.submitted = false);
  }


  private generatePaymentOrder(payableUID: string) {
    this.submitted = true;

    this.payableData.generatePaymentOrder(payableUID)
      .firstValue()
      .then(x => this.resolvePayableUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolvePayableUpdated(data: PayableData) {
    sendEvent(this.payableEditorEvent, PayableEditorEventType.PAYABLE_UPDATED, { data });
  }


  private resolvePayableDeleted(payableUID: string) {
    sendEvent(this.payableEditorEvent, PayableEditorEventType.PAYABLE_DELETED, { payableUID });
  }

}
