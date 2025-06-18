/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { AccountabilityDataService } from '@app/data-services';

import { Accountability, AccountabilityDescriptor, EmptyAccountability, OrgUnitHolder,
         PartyRelationFields } from '@app/models';

import { AccountabilitiesControlsEventType } from './accountabilities-controls.component';

import { AccountabilityEditorEventType } from './accountability-editor.component';

import { AccountabilitiesTableEventType } from './accountabilities-table.component';


export enum AccountabilitiesEditionEventType {
  UPDATED = 'AccountabilitiesEditionComponent.Event.Updated',
}


@Component({
  selector: 'emp-ng-accountabilities-edition',
  templateUrl: './accountabilities-edition.component.html',
})
export class AccountabilitiesEditionComponent implements OnChanges {

  @Input() commissionerUID = '';

  @Input() data: AccountabilityDescriptor[] = [];

  @Input() canEdit = false;

  @Output() accountabilitiesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';

  displayEditor = false;

  selectedData: Accountability = EmptyAccountability;


  constructor(private accountabilityData: AccountabilityDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.filter = '';
  }


  onAccountabilitiesControlsEvent(event: EventInfo) {
    switch (event.type as AccountabilitiesControlsEventType) {
      case AccountabilitiesControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case AccountabilitiesControlsEventType.CREATE_CLICKED:
        this.setSelectedData(EmptyAccountability, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onAccountabilityEditorEvent(event: EventInfo) {
    switch (event.type as AccountabilityEditorEventType) {
      case AccountabilityEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAccountability);
        return;
      case AccountabilityEditorEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createAccountability(event.payload.dataFields as PartyRelationFields);
        return;
      case AccountabilityEditorEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.accountabilityUID, 'event.payload.accountabilityUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateAccountability(event.payload.accountabilityUID,
                                  event.payload.dataFields as PartyRelationFields);
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
        this.getAccountability(event.payload.item.uid);
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


  private getAccountability(accountabilityUID: string) {
    this.submitted = true;

    this.accountabilityData.getAccountability(accountabilityUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.submitted = false);
  }


  private createAccountability(dataFields: PartyRelationFields) {
    this.submitted = true;

    this.accountabilityData.createAccountability(dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private updateAccountability(accountabilityUID: string, dataFields: PartyRelationFields) {
    this.submitted = true;

    this.accountabilityData.updateAccountability(accountabilityUID, dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteAccountability(accountabilityUID: string) {
    this.submitted = true;

    this.accountabilityData.deleteAccountability(accountabilityUID)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private setSelectedData(data: Accountability, display?: boolean) {
    this.selectedData = data;
    this.displayEditor = display ?? !isEmpty(data);
  }


  private confirmRemove(data: AccountabilityDescriptor) {
    const title = 'Eliminar responsabilidad';
    const message = this.getConfirmRemoveAccountMessage(data);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.deleteAccountability(data.uid) : null);
  }


  private getConfirmRemoveAccountMessage(data: AccountabilityDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Rol: </td><td><strong>${data.roleName}</strong></td></tr>
        <tr><td class='nowrap'>Responsable: </td><td><strong>${data.responsibleName}</strong></td></tr>
      </table>
      <br>¿Elimino la responsabilidad?`;
  }


  private resolveUpdated(data: OrgUnitHolder) {
    const payload = { data };
    sendEvent(this.accountabilitiesEditionEvent, AccountabilitiesEditionEventType.UPDATED, payload);
    this.setSelectedData(EmptyAccountability);
  }

}
