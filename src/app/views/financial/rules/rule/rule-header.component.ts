/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { FinancialRule, FinancialRuleFields, EmptyFinancialRule} from '@app/models';


export enum FinancialRuleHeaderEventType {
  CREATE = 'FinancialRuleHeaderComponent.Event.Create',
  UPDATE = 'FinancialRuleHeaderComponent.Event.Update',
  DELETE = 'FinancialRuleHeaderComponent.Event.Delete',
}

interface FinancialRuleFormModel extends FormGroup<{
  categoryUID: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
  debitAccount: FormControl<string>;
  creditAccount: FormControl<string>;
  debitConcept: FormControl<string>;
  creditConcept: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-financial-rule-header',
  templateUrl: './rule-header.component.html',
})
export class FinancialRuleHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() canUpdate = false;

  @Input() rule: FinancialRule = EmptyFinancialRule;

  @Output() ruleHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: FinancialRuleFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  categoriesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.rule && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.canUpdate;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? FinancialRuleHeaderEventType.UPDATE :
        FinancialRuleHeaderEventType.CREATE;
      sendEvent(this.ruleHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(FinancialRuleHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(FinancialStateSelector.RULES_CATEGORIES)
      .subscribe(x => {
        this.categoriesList = x;
        this.isLoading = x.length === 0;
      });
  }


  private validateDataLists() {
    this.categoriesList =
      ArrayLibrary.insertIfNotExist(this.categoriesList ?? [], this.rule.category, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      categoryUID: ['', Validators.required],
      debitAccount: [''],
      creditAccount: [''],
      debitConcept: [''],
      creditConcept: [''],
      startDate: [null],
      endDate: [null],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        categoryUID: isEmpty(this.rule.category) ? null : this.rule.category.uid,
        debitAccount: this.rule.debitAccount ?? '',
        creditAccount: this.rule.creditAccount ?? '',
        debitConcept: this.rule.debitConcept ?? '',
        creditConcept: this.rule.creditConcept ?? '',
        startDate: this.rule.startDate ?? '',
        endDate: this.rule.endDate ?? '',
        description: this.rule.description ?? '',
      });

      this.validateFieldsRequired();
    });
  }


  private validateFieldsRequired() {

  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private getFormData(): FinancialRuleFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FinancialRuleFields = {
      categoryUID: this.form.value.categoryUID ?? null,
      debitAccount: this.form.value.debitAccount ?? null,
      creditAccount: this.form.value.creditAccount ?? null,
      debitConcept: this.form.value.debitConcept ?? null,
      creditConcept: this.form.value.creditConcept ?? null,
      startDate: this.form.value.startDate ?? null,
      endDate: this.form.value.endDate ?? null,
      description: this.form.value.description ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: FinancialRuleHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.ruleHeaderEvent, eventType, { contractUID: this.rule.uid }));
  }


  private getConfirmType(eventType: FinancialRuleHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case FinancialRuleHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: FinancialRuleHeaderEventType): string {
    switch (eventType) {
      case FinancialRuleHeaderEventType.DELETE: return 'Eliminar regla contable';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: FinancialRuleHeaderEventType): string {
    switch (eventType) {
      case FinancialRuleHeaderEventType.DELETE:
        return `Esta operación eliminará la regla contable seleccionada de la categoría
                <strong>${this.rule.category.name}</strong>
                <br><br>¿Elimino la regla contable?`;

      default: return '';
    }
  }

}
