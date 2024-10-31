/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  SelectBoxTypeaheadComponent
} from '@app/shared/form-controls/select-box-typeahead/select-box-typeahead.component';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { BudgetType, EmptyPayable, EmptyPayableActions, EmptyPayableEntity, Payable, PayableActions,
         PayableEntity, PayableFields, RequestsList } from '@app/models';


export enum PayableHeaderEventType {
  CREATE_PAYABLE = 'PayableHeaderComponent.Event.CreatePayable',
  UPDATE_PAYABLE = 'PayableHeaderComponent.Event.UpdatePayable',
  DELETE_PAYABLE = 'PayableHeaderComponent.Event.DeletePayable',
}

interface PayableFormModel extends FormGroup<{
  organizationalUnitUID: FormControl<string>;
  payableTypeUID: FormControl<string>;
  payableEntityUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  payToUID: FormControl<string>;
  currencyUID: FormControl<string>;
  dueTime: FormControl<DateString>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payable-header',
  templateUrl: './payable-header.component.html',
})
export class PayableHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('payableEntitySearcher') payableEntitySearcher: SelectBoxTypeaheadComponent;

  @Input() isSaved = false;

  @Input() payable: Payable = EmptyPayable;

  @Input() payableEntity: PayableEntity = EmptyPayableEntity;

  @Input() actions: PayableActions = EmptyPayableActions;

  @Output() payableHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PayableFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  payableTypesList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  suppliersAPI = SearcherAPIS.suppliers;

  payableEntitiesAPI = SearcherAPIS.payableEntities;


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
    if (changes.payable && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return Object.values(this.actions.can).some(x => !!x);
  }


  onPayableTypeChanges() {
    this.resetPayableEntity();
    this.validatePayableTypeDisabled();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = PayableHeaderEventType.CREATE_PAYABLE;

      if (this.isSaved) {
        eventType = PayableHeaderEventType.UPDATE_PAYABLE;
      }

      sendEvent(this.payableHeaderEvent, eventType, { payableFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(PayableHeaderEventType.DELETE_PAYABLE);
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

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<BudgetType[]>(PaymentsStateSelector.PAYABLES_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.organizationalUnitsList = a;
      this.budgetTypesList = b;
      this.payableTypesList = c;
      this.currenciesList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      organizationalUnitUID: ['', Validators.required],
      payableTypeUID: ['', Validators.required],
      payableEntityUID: ['', Validators.required],
      budgetTypeUID: ['', Validators.required],
      payToUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      description: ['', Validators.required],
      dueTime: [null as DateString, Validators.required],
    });

    this.validateFormControls();
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        organizationalUnitUID: isEmpty(this.payable.requestedBy) ? null : this.payable.requestedBy.uid,
        payableTypeUID: isEmpty(this.payable.payableType) ? null : this.payable.payableType.uid,
        payableEntityUID: isEmpty(this.payableEntity) ? null : this.payableEntity.uid,
        budgetTypeUID: isEmpty(this.payable.budgetType) ? null : this.payable.budgetType.uid,
        payToUID: isEmpty(this.payable.payTo) ? null : this.payable.payTo.uid,
        currencyUID: isEmpty(this.payable.currency) ? null : this.payable.currency.uid,
        description: this.payable.description ?? '',
        dueTime: this.payable.dueTime ?? null,
      });
    });
  }


  private getFormData(): PayableFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PayableFields = {
      payableTypeUID: this.form.value.payableTypeUID ?? '',
      payableEntityUID: this.form.value.payableEntityUID ?? '',
      description: this.form.value.description ?? '',
      organizationalUnitUID: this.form.value.organizationalUnitUID ?? '',
      payToUID: this.form.value.payToUID ?? '',
      currencyUID: this.form.value.currencyUID ?? '',
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      dueTime: this.form.value.dueTime ?? '',
    };

    return data;
  }


  private validateFormControls() {
    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.payToUID);
      FormHelper.markControlsAsUntouched(this.form.controls.payableEntityUID);
      FormHelper.setDisableControl(this.form.controls.payableEntityUID);
    }, 10);
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.can.update);
      this.formHelper.setDisableForm(this.form, disable);
      if (!disable) this.validatePayableTypeDisabled();
    });
  }


  private resetPayableEntity() {
    this.form.controls.payableEntityUID.reset();

    if (this.isSaved) {
      this.payableEntitySearcher.clearSearcherData(); // TODO: check this when it has initial value
    }
  }


  private validatePayableTypeDisabled() {
    setTimeout(() => {
      const disable = !this.form.value.payableTypeUID;
      FormHelper.setDisableControl(this.form.controls.payableEntityUID, disable);
    });
  }


  private showConfirmMessage(eventType: PayableHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: PayableHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PayableHeaderEventType.DELETE_PAYABLE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PayableHeaderEventType): string {
    switch (eventType) {
      case PayableHeaderEventType.DELETE_PAYABLE: return 'Eliminar obligación de pago';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PayableHeaderEventType): string {
    switch (eventType) {
      case PayableHeaderEventType.DELETE_PAYABLE:
        return `Esta operación eliminará la obligación de pago <strong>${this.payable.payableNo}</strong> ` +
               `solicitada por ${this.payable.requestedBy.name} con documento relacionado ` +
               `<strong>${this.payable.payableType.name}: ${this.payableEntity.entityNo}</strong>.

                <br><br>¿Elimino la obligación de pago?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: PayableHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.payableHeaderEvent, eventType, { payableUID: this.payable.uid });
    }
  }

}
