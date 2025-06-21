/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { AccountabilitiesDataService } from '@app/data-services';

import { Accountability, AccountabilityDescriptor, EmptyAccountability, OrgUnitHolder, PartyRelationFields,
         PartyRelationType } from '@app/models';

import { AccountabilitiesControlsEventType } from '../accountabilities-edition/accountabilities-controls.component';

import { AccountabilityEditorEventType } from '../accountabilities-edition/accountability-editor.component';

import { AccountabilitiesTableEventType } from '../accountabilities-edition/accountabilities-table.component';


export enum AccountabilitiesEditionEventType {
  UPDATED = 'CommisionerAccountabilitiesEditionComponent.Event.Updated',
}


@Component({
  selector: 'emp-ng-commisioner-accountabilities-edition',
  templateUrl: './commissioner-accountabilities-edition.component.html',
})
export class CommisionerAccountabilitiesEditionComponent implements OnChanges {

  @Input() commissionerUID = '';

  @Input() data: AccountabilityDescriptor[] = [];

  @Input() canEdit = false;

  @Output() accountabilitiesEditionEvent = new EventEmitter<EventInfo>();

  partyRelationTypesList: PartyRelationType[] = [];

  submitted = false;

  isLoading = false;

  filter = '';

  displayEditor = false;

  selectedData: Accountability = EmptyAccountability;


  constructor(private accountabilitiesData: AccountabilitiesDataService) { }


  ngOnChanges() {
    this.resetFilter();
    this.validateLoadDataLists();
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
        this.deleteAccountability(event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateLoadDataLists() {
    if (!this.commissionerUID) {
      this.partyRelationTypesList = [];
      return;
    }

    this.loadDataLists();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.accountabilitiesData.getStructureForEditAccountabilities(this.commissionerUID)
      .firstValue()
      .then(x => this.partyRelationTypesList = x.partyRelationCategories ?? [])
      .finally(() => this.isLoading = false);
  }


  private getAccountability(accountabilityUID: string) {
    this.submitted = true;

    this.accountabilitiesData.getAccountability(accountabilityUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.submitted = false);
  }


  private createAccountability(dataFields: PartyRelationFields) {
    this.submitted = true;

    this.accountabilitiesData.createAccountability(dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private updateAccountability(accountabilityUID: string, dataFields: PartyRelationFields) {
    this.submitted = true;

    this.accountabilitiesData.updateAccountability(accountabilityUID, dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteAccountability(accountabilityUID: string) {
    this.submitted = true;

    this.accountabilitiesData.deleteAccountability(accountabilityUID)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private setSelectedData(data: Accountability, display?: boolean) {
    this.selectedData = data;
    this.displayEditor = display ?? !isEmpty(data);
  }


  private resolveUpdated(data: OrgUnitHolder) {
    const payload = { data };
    sendEvent(this.accountabilitiesEditionEvent, AccountabilitiesEditionEventType.UPDATED, payload);
    this.setSelectedData(EmptyAccountability);
  }


  private resetFilter() {
    this.filter = '';
  }

}
