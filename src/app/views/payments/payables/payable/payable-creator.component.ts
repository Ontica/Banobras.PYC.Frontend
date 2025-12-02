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

import { PayablesDataService } from '@app/data-services';

import { PayableHolder, PayableFields } from '@app/models';

import { PayableHeaderEventType } from './payable-header.component';


export enum PayableCreatorEventType {
  CLOSE_MODAL_CLICKED = 'PayableCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'PayableCreatorComponent.Event.Created',
}

@Component({
  selector: 'emp-pmt-payable-creator',
  templateUrl: './payable-creator.component.html',
})
export class PayableCreatorComponent {

  @Output() payableCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private payablesData: PayablesDataService) { }


  onCloseModalClicked() {
    sendEvent(this.payableCreatorEvent, PayableCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onPayableHeaderEvent(event: EventInfo) {
    switch (event.type as PayableHeaderEventType) {
      case PayableHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createPayable(event.payload.dataFields as PayableFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createPayable(dataFields: PayableFields) {
    this.submitted = true;

    this.payablesData.createPayable(dataFields)
      .firstValue()
      .then(x => this.resolvePayableCreated(x))
      .finally(() => this.submitted = false);
  }


  private resolvePayableCreated(data: PayableHolder) {
    sendEvent(this.payableCreatorEvent, PayableCreatorEventType.CREATED, { data });
  }

}
