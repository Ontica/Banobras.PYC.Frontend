/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { Bill, EmptyBill, BaseActions, EmptyBaseActions } from '@app/models';

import { BillHeaderEventType } from './bill-header.component';


export enum BillEditorEventType {
  UPDATED = 'BillEditorComponent.Event.BillUpdated',
  DELETED = 'BillEditorComponent.Event.BillDeleted',
}

@Component({
  selector: 'emp-ng-bill-editor',
  templateUrl: './bill-editor.component.html',
})
export class BillEditorComponent {

  @Input() bill: Bill = EmptyBill;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() billEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.bill);
  }


  @SkipIf('submitted')
  onBillHeaderEvent(event: EventInfo) {
    switch (event.type as BillHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
