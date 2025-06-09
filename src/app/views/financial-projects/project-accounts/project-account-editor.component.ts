/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { FinancialAccount, EmptyFinancialAccount, FinancialAccountFields, ObjectTypes,
         AccountAttributes, FinancialData, RequestsList } from '@app/models';


export enum ProjectAccountEditorEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialProjectAccountEditorComponent.Event.CloseButtonClicked',
  CREATE_CLICKED       = 'FinancialProjectAccountEditorComponent.Event.CreateClicked',
  UPDATE_CLICKED       = 'FinancialProjectAccountEditorComponent.Event.UpdateClicked',
}

interface ProjectAccountFormModel extends FormGroup<{
  financialAccountTypeUID: FormControl<string>;
  standardAccountUID: FormControl<string>;
  organizationalUnitUID: FormControl<string>;
  accountNo: FormControl<string>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
  attributes: FormControl<AccountAttributes>;
  financialData: FormControl<FinancialData>;
}> { }

@Component({
  selector: 'emp-cf-project-account-editor',
  templateUrl: './project-account-editor.component.html',
})
export class FinancialProjectAccountEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() projectUID = '';

  @Input() account: FinancialAccount = EmptyFinancialAccount;

  @Input() canUpdate = false;

  @Output() projectAccountEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProjectAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  accountTypesList: Identifiable[] = [];

  standardAccountsList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private projectsData: FinancialProjectsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.isSaved && changes.account) {
      this.enableEditor();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get title(): string {
    if (!this.isSaved) return 'Agregar cuenta';
    return `${this.canUpdate ? 'Editar' : 'Detalle de la '} cuenta - ${this.account.accountNo}`;
  }


  get isSaved(): boolean {
    return !isEmpty(this.account);
  }


  get isCreditAccount(): boolean {
    return this.form.value.financialAccountTypeUID === ObjectTypes.CREDIT_ACCOUNT;
  }


  onFinancialAccountTypeChanges(type: Identifiable) {
    // TODO: validar campos requeridos y corregir atibutos dinamicos....
    // los manejo en control attributes o defino uno para cada tipo??
    // si se cambia de tipo se pierden datos...
    // , Validate.objectFieldsRequired('building', 'floor', 'place')

    // if (this.isCreditAccount) {
    //   this.form.controls.attributes.reset(EmptyCreditAttributes);
    //   this.form.controls.financialData.reset(EmptyCreditFinancialData);

    //   FormHelper.setControlValidators(this.form.controls.attributes, [Validators.required,
    //      Validate.objectFieldsRequired('noCredito', 'acreditado', 'tipoCredito', 'etapaCredito')]);

    //   FormHelper.setControlValidators(this.form.controls.financialData, [Validators.required,
    //     Validate.objectFieldsRequired('interes', 'comision', 'saldo', 'plazoInversion', 'periodoGracia',
    //       'plazoAmortizacion', 'fechaAmortizacion', 'tipoCambio', 'tas', 'factorTasa', 'tasaPiso', 'tasaTecho')]);
    // } else {
    //   this.form.controls.attributes.reset(null);
    //   this.form.controls.financialData.reset(null);

    //   FormHelper.clearControlValidators(this.form.controls.attributes);
    //   FormHelper.clearControlValidators(this.form.controls.financialData);
    // }
  }


  onCloseButtonClicked() {
    sendEvent(this.projectAccountEditorEvent, ProjectAccountEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ProjectAccountEditorEventType.UPDATE_CLICKED :
        ProjectAccountEditorEventType.CREATE_CLICKED;

      const payload = {
        projectUID: this.projectUID,
        accountUID: this.isSaved ? this.account?.uid : null,
        dataFields: this.getFormData()
      };

      sendEvent(this.projectAccountEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.projectsData.getStandardAccounts(this.projectUID),
      this.projectsData.getFinancialAccountsTypes(this.projectUID),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.standardAccountsList = b;
      this.accountTypesList = c;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      financialAccountTypeUID: ['', Validators.required],
      standardAccountUID: ['', Validators.required],
      organizationalUnitUID: ['', Validators.required],
      accountNo: [''],
      tags: [null],
      description: [''],
      attributes: [null],
      financialData: [null],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        financialAccountTypeUID: isEmpty(this.account.financialAccountType) ? null : this.account.financialAccountType.uid,
        standardAccountUID: isEmpty(this.account.standardAccount) ? null : this.account.standardAccount.uid,
        organizationalUnitUID: isEmpty(this.account.organizationalUnit) ? null : this.account.organizationalUnit.uid,
        accountNo: this.account.accountNo ?? '',
        tags: this.account.tags ?? [],
        description: this.account.description ?? null,
        attributes: this.account.attributes ?? null,
        financialData: this.account.financialData ?? null,
      });
    });
  }


  private validateFormDisabled() {
    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private getFormData(): FinancialAccountFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: FinancialAccountFields = {
      financialAccountTypeUID: formModel.financialAccountTypeUID ?? '',
      standardAccountUID: formModel.standardAccountUID ?? '',
      organizationalUnitUID: formModel.organizationalUnitUID ?? '',
      accountNo: formModel.accountNo ?? '',
      tags: formModel.tags ?? [],
      description: formModel.description ?? '',
      attributes: formModel.attributes ?? null,
      financialData: formModel.financialData ?? null,
    };

    return data;
  }

}
