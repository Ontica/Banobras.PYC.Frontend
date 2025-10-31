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

import { FinancialRulesDataService } from '@app/data-services';

import { FinancialRule, FinancialRuleFields, EmptyFinancialRule } from '@app/models';

import { FinancialRuleHeaderEventType } from './rule-header.component';


export enum FinancialRuleEditorEventType {
  UPDATED = 'FinancialRuleEditorComponent.Event.Updated',
  DELETED = 'FinancialRuleEditorComponent.Event.Deleted',
}

@Component({
  selector: 'emp-financial-rule-editor',
  templateUrl: './rule-editor.component.html',
})
export class FinancialRuleEditorComponent {

  @Input() rule: FinancialRule = EmptyFinancialRule;

  @Input() canUpdate = false;

  @Output() ruleEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private rulesData: FinancialRulesDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.rule);
  }


  @SkipIf('submitted')
  onRuleHeaderEvent(event: EventInfo) {
    switch (event.type as FinancialRuleHeaderEventType) {
      case FinancialRuleHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateRule(event.payload.dataFields as FinancialRuleFields);
        return;
      case FinancialRuleHeaderEventType.DELETE:
        this.deleteRule();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateRule(dataFields: FinancialRuleFields) {
    this.submitted = true;

    this.rulesData.updateRule(this.rule.uid, dataFields)
      .firstValue()
      .then(x => sendEvent(this.ruleEditorEvent, FinancialRuleEditorEventType.UPDATED, { data: x }))
      .finally(() => this.submitted = false);
  }


  private deleteRule() {
    this.submitted = true;

    this.rulesData.deleteRule(this.rule.uid)
      .firstValue()
      .then(() =>
        sendEvent(this.ruleEditorEvent, FinancialRuleEditorEventType.DELETED, { dataUID: this.rule.uid })
      )
      .finally(() => this.submitted = false);
  }

}
