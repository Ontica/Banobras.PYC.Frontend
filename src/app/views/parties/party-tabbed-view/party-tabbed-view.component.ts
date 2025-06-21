/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPartyExplorerTypeConfig, EmptyPartyHolder, ExplorerTypeConfig, OrgUnit, OrgUnitHolder,
         Party, PartyHolder, PartyObjectTypes, SupplierHolder } from '@app/models';

import { PartyViewEventType } from './party-view.component';

import {
  CommisionerAccountabilitiesEditionEventType
} from '@app/views/_accountabilities/commissioner-accountabilities/commissioner-accountabilities-edition.component';


export enum PartyTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PartyTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'PartyTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'PartyTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'PartyTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-ng-party-tabbed-view',
  templateUrl: './party-tabbed-view.component.html',
})
export class PartyTabbedViewComponent implements OnChanges {

  @Input() config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  @Input() data: PartyHolder = EmptyPartyHolder;

  @Output() partyTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.validateSetTitle();
  }


  get displayOrgUnitData(): boolean {
    return this.config.type === PartyObjectTypes.ORGANIZATIONAL_UNITS
  }


  get displaySupplierData(): boolean {
    return this.config.type === PartyObjectTypes.SUPPLIER;
  }


  get orgUnitHolder(): OrgUnitHolder {
    return (this.data as OrgUnitHolder);
  }


  get supplierHolder(): SupplierHolder {
    return (this.data as SupplierHolder);
  }


  get party(): Party {
    switch (this.config.type) {
      case PartyObjectTypes.ORGANIZATIONAL_UNITS: return this.orgUnitHolder.organizationalUnit;
      case PartyObjectTypes.SUPPLIER: return this.supplierHolder.supplier;
      default: return this.data.party;
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.partyTabbedViewEvent, PartyTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPartyViewEvent(event: EventInfo) {
    switch (event.type as PartyViewEventType) {
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountabilitiesEditionEvent(event: EventInfo) {
    switch (event.type as CommisionerAccountabilitiesEditionEventType) {
      case CommisionerAccountabilitiesEditionEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.partyTabbedViewEvent, PartyTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateSetTitle() {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        return this.setPartyTitle(this.supplierHolder.supplier);
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        return this.setOrgUnitTitle(this.orgUnitHolder.organizationalUnit);
      default:
        return this.setPartyTitle(this.data.party ?? null);
    }
  }


  private setPartyTitle(data: Party) {
    const type = isEmpty(data.type) ? 'N/D' : data.type.name + ''
    const status = isEmpty(data.status) ? '' : (
      data.status.name === 'Eliminada' ?
        `<span class="tag tag-error tag-small">${data.status.name}</span>` :
        `<span class="tag tag-small">${data.status.name}</span>`
    );

    this.title = `${data.name} ${status}`;

    this.hint = `<strong>${type}</strong>`;
  }


  private setOrgUnitTitle(data: OrgUnit) {
    const startDate = !data.startDate ? 'N/D' : DateStringLibrary.format(data.startDate);

    const status = isEmpty(data.status) ? '' : (
      data.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${data.status.name}</span>` :
      `<span class="tag tag-small">${data.status.name}</span>`
    );

    this.title = `${data.code}: ${data.name} ${status}`;

    this.hint = `<strong>${data.type.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${data.responsible.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${startDate}`;
  }

}
