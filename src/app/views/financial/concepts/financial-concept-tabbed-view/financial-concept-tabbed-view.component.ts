/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptHolder, EmptyFinancialConceptHolder } from '@app/models';

import { FinancialConceptViewEventType } from './financial-concept-view.component';

import { FinancialConceptIntegrationTableEventType } from './financial-concept-integration-table.component';


export enum FinancialConceptTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialConceptTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'FinancialConceptTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'FinancialConceptTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'FinancialConceptTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-financial-concept-tabbed-view',
  templateUrl: './financial-concept-tabbed-view.component.html',
})
export class FinancialConceptTabbedViewComponent implements OnChanges {

  @Input() data: FinancialConceptHolder = EmptyFinancialConceptHolder;

  @Output() conceptTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.conceptTabbedViewEvent, FinancialConceptTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onConceptViewEvent(event: EventInfo) {
    switch (event.type as FinancialConceptViewEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onConceptIntegrationTableEvent(event: EventInfo) {
    switch (event.type as FinancialConceptIntegrationTableEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.data.concept.number}: ${this.data.concept.name}`;

    this.hint = `<strong>${this.data.concept.group.name} &nbsp; | &nbsp; </strong>` +
      `${this.data.concept.fullName}`;
  }

}
