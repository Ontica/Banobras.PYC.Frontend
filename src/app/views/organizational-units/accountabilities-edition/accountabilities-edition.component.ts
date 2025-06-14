/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { AccountabilityDescriptor } from '@app/models';

import { AccountabilitiesControlsEventType } from './accountabilities-controls.component';

import { AccountabilitiesTableEventType } from './accountabilities-table.component';


export enum AccountabilitiesEditionEventType {
  UPDATED = 'AccountabilitiesEditionComponent.Event.Updated',
}


@Component({
  selector: 'emp-ng-accountabilities-edition',
  templateUrl: './accountabilities-edition.component.html',
})
export class AccountabilitiesEditionComponent implements OnChanges {

  @Input() data: AccountabilityDescriptor[] = [];

  @Input() canEdit = false;

  @Output() accountabilitiesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.filter = '';
  }


  onAccountabilitiesControlsEvent(event: EventInfo) {
    switch (event.type as AccountabilitiesControlsEventType) {
      case AccountabilitiesControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case AccountabilitiesControlsEventType.CREATE_CLICKED:
        this.messageBox.showInDevelopment('Agregar responsable');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onAccountabilitiesTableEvent(event: EventInfo) {
    switch (event.type as AccountabilitiesTableEventType) {
      case AccountabilitiesTableEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Actualizar responsable', event.payload.item);
        return;
      case AccountabilitiesTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.confirmRemove(event.payload.item as AccountabilityDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private confirmRemove(data: AccountabilityDescriptor) {
    const title = 'Eliminar responsabilidad';
    const message = this.getConfirmRemoveAccountMessage(data);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.messageBox.showInDevelopment('Eliminar responsabilidad', data) : null);
  }


  private getConfirmRemoveAccountMessage(data: AccountabilityDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Rol: </td><td><strong>${data.roleName}</strong></td></tr>
        <tr><td class='nowrap'>Responsable: </td><td><strong>${data.responsibleName}</strong></td></tr>
        <tr><td class='nowrap'>Comisionado por: </td><td><strong>${data.commissionerName}</strong></td></tr>
      </table>
      <br>¿Elimino la responsabilidad?`;
  }


  private resolveUpdated(dataUID: string) {
    const payload = { dataUID };
    sendEvent(this.accountabilitiesEditionEvent, AccountabilitiesEditionEventType.UPDATED, payload);
  }

}
