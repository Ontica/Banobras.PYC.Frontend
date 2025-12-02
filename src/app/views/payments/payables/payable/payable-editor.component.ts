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

import { PayablesDataService } from '@app/data-services';

import { EmptyPayable, EmptyPayableActions, EmptyPayableEntity, Payable, PayableActions, PayableHolder,
         PayableEntity, PayableFields } from '@app/models';

import { PayableHeaderEventType } from './payable-header.component';


export enum PayableEditorEventType {
  UPDATED = 'PayableEditorComponent.Event.Updated',
  DELETED = 'PayableEditorComponent.Event.Deleted',
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


  constructor(private payablesData: PayablesDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.payable);
  }


  @SkipIf('submitted')
  onPayableHeaderEvent(event: EventInfo) {
    switch (event.type as PayableHeaderEventType) {
      case PayableHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updatePayable(this.payable.uid, event.payload.dataFields as PayableFields);
        return;
      case PayableHeaderEventType.DELETE:
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


  private updatePayable(dataUID: string, dataFields: PayableFields) {
    this.submitted = true;

    this.payablesData.updatePayable(dataUID, dataFields)
      .firstValue()
      .then(x => this.resolvePayableUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deletePayable(dataUID: string) {
    this.submitted = true;

    this.payablesData.deletePayable(dataUID)
      .firstValue()
      .then(() => this.resolvePayableDeleted(dataUID))
      .finally(() => this.submitted = false);
  }


  private generatePaymentOrder(dataUID: string) {
    this.submitted = true;

    this.payablesData.generatePaymentOrder(dataUID)
      .firstValue()
      .then(x => this.resolvePayableUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolvePayableUpdated(data: PayableHolder) {
    sendEvent(this.payableEditorEvent, PayableEditorEventType.UPDATED, { data });
  }


  private resolvePayableDeleted(dataUID: string) {
    sendEvent(this.payableEditorEvent, PayableEditorEventType.DELETED, { dataUID });
  }

}
