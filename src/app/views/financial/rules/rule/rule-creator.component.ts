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

import { FinancialRulesDataService } from '@app/data-services';

import { FinancialRuleFields } from '@app/models';

import { FinancialRuleHeaderEventType } from './rule-header.component';


export enum FinancialRuleCreatorEventType {
  CLOSE_MODAL_CLICKED = 'FinancialRuleCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'FinancialRuleCreatorComponent.Event.Created',
}

@Component({
  selector: 'emp-financial-rule-creator',
  templateUrl: './rule-creator.component.html',
})
export class FinancialRuleCreatorComponent {

  @Output() ruleCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private rulesData: FinancialRulesDataService) { }


  onCloseModalClicked() {
    sendEvent(this.ruleCreatorEvent, FinancialRuleCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onRuleHeaderEvent(event: EventInfo) {
    switch (event.type as FinancialRuleHeaderEventType) {
      case FinancialRuleHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createRule(event.payload.dataFields as FinancialRuleFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createRule(dataFields: FinancialRuleFields) {
    this.submitted = true;

    this.rulesData.createRule(dataFields)
      .firstValue()
      .then(x => sendEvent(this.ruleCreatorEvent, FinancialRuleCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
