/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialRule, EmptyFinancialRule } from '@app/models';

import { FinancialRuleEditorEventType } from '../rule/rule-editor.component';


export enum FinancialRuleTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialRuleTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'FinancialRuleTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'FinancialRuleTabbedViewComponent.Event.DataDeleted',
}

@Component({
  selector: 'emp-financial-rule-tabbed-view',
  templateUrl: './rule-tabbed-view.component.html',
})
export class FinancialRuleTabbedViewComponent implements OnChanges {

  @Input() data: FinancialRule = EmptyFinancialRule;

  @Input() dataIDField: string = null;

  @Output() ruleTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.ruleTabbedViewEvent, FinancialRuleTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onRuleEditorEvent(event: EventInfo) {
    switch (event.type as FinancialRuleEditorEventType) {
      case FinancialRuleEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.ruleTabbedViewEvent,
          FinancialRuleTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case FinancialRuleEditorEventType.DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        sendEvent(this.ruleTabbedViewEvent,
          FinancialRuleTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const startDate = !this.data.startDate ? 'N/D' : DateStringLibrary.format(this.data.startDate);

    const status = this.data.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.status.name}</span>` :
      `<span class="tag tag-small">${this.data.status.name}</span>`;

    this.title = `${this.data.category.name} ${status}`;

    this.hint = `<strong>${this.data[this.dataIDField] ?? 'N/D'} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
    `${startDate}`;
  }

}
