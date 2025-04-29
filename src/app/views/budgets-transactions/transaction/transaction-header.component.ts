/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { SelectBoxTypeaheadComponent } from '@app/shared/form-controls';

import { MessageBoxService } from '@app/shared/services';

import { BudgetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { BudgetForEdition, BudgetTransaction, BudgetTransactionFields, BudgetTypeForEdition,
         EmptyBudgetTransaction, EmptyTransactionActions, TransactionActions,
         BudgetTransactionType } from '@app/models';


export enum TransactionHeaderEventType {
  CREATE            = 'BudgetTransactionHeaderComponent.Event.CreateTransaction',
  UPDATE            = 'BudgetTransactionHeaderComponent.Event.UpdateTransaction',
  DELETE            = 'BudgetTransactionHeaderComponent.Event.DeleteTransaction',
  SEND_TO_AUTHORIZE = 'BudgetTransactionHeaderComponent.Event.SendToAuthorizationTransaction',
  AUTHORIZE         = 'BudgetTransactionHeaderComponent.Event.AuthorizeTransaction',
  REJECT            = 'BudgetTransactionHeaderComponent.Event.RejectTransaction',
}

interface TransactionFormModel extends FormGroup<{
  basePartyUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
  applicationDate: FormControl<DateString>;
  justification: FormControl<string>;
  baseEntityTypeUID: FormControl<string>;
  baseEntityUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-transaction-header',
  templateUrl: './transaction-header.component.html',
})
export class BudgetTransactionHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('baseEntitySearcher') baseEntitySearcher: SelectBoxTypeaheadComponent;

  @Input() isSaved = false;

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() actions: TransactionActions = EmptyTransactionActions;

  @Output() transactionHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: TransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingOrgUnits = false;

  budgetTypesList: BudgetTypeForEdition[] = [];

  budgetsList: BudgetForEdition[] = [];

  transactionTypesList: BudgetTransactionType[] = [];

  orgUnitsList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  baseEntityTypesList: Identifiable[] = [];

  eventType = TransactionHeaderEventType;

  baseEntitiesAPI = SearcherAPIS.relatedDocumentsForEdition;


  constructor(private uiLayer: PresentationLayer,
              private budgetTransactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canAuthorize || this.actions.canReject ||
           this.actions.canDelete || this.actions.canUpdate;
  }


  get budgetTypePlaceholder(): string {
    return this.form.controls.budgetTypeUID.invalid ? 'Seleccione tipo de presupuesto' : 'Seleccionar';
  }


  get budgetPlaceholder(): string {
    return this.form.controls.budgetUID.invalid ? 'Seleccione presupuesto' : 'Seleccionar';
  }


  get transactionTypePlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    return this.form.controls.transactionTypeUID.invalid ? 'Seleccione tipo de transacción' : 'Seleccionar';
  }


  get baseEntityTypePlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().transactionTypeUID) {
      return 'Seleccione tipo de transacción';
    }

    if (this.baseEntityTypesList.length === 0) {
      return 'No aplica';
    }

    return 'Seleccionar';
  }


  get baseEntityPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().transactionTypeUID) {
      return 'Seleccione tipo de transacción';
    }

    if (this.baseEntityTypesList.length === 0) {
      return 'No aplica';
    }

    if (!this.form.getRawValue().basePartyUID) {
      return 'Seleccione área';
    }

    if (!this.form.getRawValue().baseEntityTypeUID) {
      return 'Seleccione tipo de documento relacionado';
    }

    return 'Buscar documento...';
  }


  onBudgetTypeChanged(budgetType: BudgetTypeForEdition) {
    this.form.controls.budgetUID.reset();
    this.form.controls.transactionTypeUID.reset();
    this.form.controls.basePartyUID.reset();
    this.form.controls.operationSourceUID.reset();
    this.form.controls.baseEntityTypeUID.reset();
    this.form.controls.baseEntityUID.reset();

    this.setBudgetList(budgetType?.budgets ?? []);
    this.setTransactionTypesList([]);
    this.setOrgUnitsList([]);
    this.setOperationSourcesList([]);
    this.setBaseEntityTypesList([]);

    this.validateBaseEntityFields();
  }


  onBudgetChanges(budget: BudgetForEdition) {
    this.form.controls.transactionTypeUID.reset();
    this.form.controls.basePartyUID.reset();
    this.form.controls.operationSourceUID.reset();
    this.form.controls.baseEntityTypeUID.reset();
    this.form.controls.baseEntityUID.reset();

    this.setTransactionTypesList(budget.transactionTypes);
    this.setOrgUnitsList([]);
    this.setOperationSourcesList([]);
    this.setBaseEntityTypesList([]);

    this.validateBaseEntityFields();
  }


  onTransactionTypeChanges(type: BudgetTransactionType) {
    this.form.controls.basePartyUID.reset();
    this.form.controls.operationSourceUID.reset();
    this.form.controls.baseEntityTypeUID.reset();
    this.form.controls.baseEntityUID.reset();

    this.getOrgUnitsByQuery(this.form.value.budgetUID ?? '', this.form.value.transactionTypeUID ?? '');
    this.setOperationSourcesList(type.operationSources);
    this.setBaseEntityTypesList(type.relatedDocumentTypes);

    this.validateBaseEntityFields();
  }


  onOrgUnitsChanges(orgUnit: Identifiable) {
    this.validateBaseEntityFields();
  }


  onBaseEntityTypeChanges() {
    this.form.controls.baseEntityUID.reset();

    this.validateBaseEntityFields();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? TransactionHeaderEventType.UPDATE : TransactionHeaderEventType.CREATE;
      sendEvent(this.transactionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: TransactionHeaderEventType) {
    this.showConfirmMessage(eventType);
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

    this.helper.select<BudgetTypeForEdition[]>(BudgetingStateSelector.BUDGET_TYPES_FOR_EDITION)
      .subscribe(x => {
        this.budgetTypesList = x;
        this.validateInitData();
        this.isLoading = x.length === 0;
      });
  }


  private getOrgUnitsByQuery(budgetUID: string, transactionTypeUID: string) {
    this.isLoadingOrgUnits = true;

    this.budgetTransactionsData.getOrganizationalUnitsForTransactionEdition(budgetUID, transactionTypeUID)
      .firstValue()
      .then(x => {
        this.setOrgUnitsList(x);
        this.isLoadingOrgUnits = false;
      });
  }


  private validateInitData() {
    if (this.isSaved) {
      const budgetType = this.budgetTypesList.find(x => x.uid === this.transaction.budgetType.uid);

      if (!isEmpty(budgetType) && budgetType?.budgets?.length > 0) {
        const budget = budgetType.budgets.find(x => x.uid === this.transaction.budget.uid);
        const transactionType = budget?.transactionTypes?.find(x => x.uid === this.transaction.transactionType.uid);
        this.setBudgetList(budgetType?.budgets ?? []);
        this.setTransactionTypesList(budget?.transactionTypes ?? []);
        this.setOperationSourcesList(transactionType?.operationSources ?? []);
        this.setBaseEntityTypesList(transactionType?.relatedDocumentTypes ?? []);
        this.getOrgUnitsByQuery(
          this.transaction.budget.uid ?? '', this.transaction.transactionType.uid ?? ''
        );
      }
    }
  }


  private validateBaseEntityFields(initData: boolean = false) {
    const entityTypeNotReady = !this.form.value.transactionTypeUID || this.baseEntityTypesList.length === 0;
    const entityNotReady = entityTypeNotReady || !this.form.value.baseEntityTypeUID || !this.form.value.basePartyUID;
    FormHelper.setDisableControl(this.form.controls.baseEntityTypeUID, entityTypeNotReady);
    FormHelper.setDisableControl(this.form.controls.baseEntityUID, entityNotReady);
    this.resetOrderSearcher(initData);
  }


  private resetOrderSearcher(initData: boolean) {
    if (!!this.baseEntitySearcher && !initData) {
      this.baseEntitySearcher.resetSearcherData();
    }
  }


  private setBudgetList(budgets: BudgetForEdition[]) {
    this.budgetsList = budgets ?? [];
  }


  private setTransactionTypesList(transactions: BudgetTransactionType[]) {
    this.transactionTypesList = transactions ?? [];
  }


  private setOperationSourcesList(operationSources: Identifiable[]) {
    this.operationSourcesList = operationSources ?? [];
  }


  private setBaseEntityTypesList(entityTypes: Identifiable[]) {
    this.baseEntityTypesList = entityTypes;
  }


  private setOrgUnitsList(orgUnits: Identifiable[]) {
    this.orgUnitsList = orgUnits ?? [];
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      basePartyUID: ['', Validators.required],
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      transactionTypeUID: ['', Validators.required],
      operationSourceUID: ['', Validators.required],
      applicationDate: ['' as DateString, Validators.required],
      justification: [''],
      baseEntityTypeUID: [''],
      baseEntityUID: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        basePartyUID: isEmpty(this.transaction.baseParty) ? null : this.transaction.baseParty.uid,
        budgetTypeUID: isEmpty(this.transaction.budgetType) ? null : this.transaction.budgetType.uid,
        budgetUID: isEmpty(this.transaction.budget) ? null : this.transaction.budget.uid,
        transactionTypeUID: isEmpty(this.transaction.transactionType) ? null : this.transaction.transactionType.uid,
        operationSourceUID: isEmpty(this.transaction.operationSource) ? null : this.transaction.operationSource.uid,
        applicationDate: this.transaction.applicationDate ?? '',
        justification: this.transaction.justification ?? '',
        baseEntityTypeUID: isEmpty(this.transaction.baseEntityType) ? null : this.transaction.baseEntityType.uid,
        baseEntityUID: isEmpty(this.transaction.baseEntity) ? null : this.transaction.baseEntity.uid,
      });

      this.validateInitData();
      this.validateBaseEntityFields(true);
    });
  }


  private getFormData(): BudgetTransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: BudgetTransactionFields = {
      basePartyUID: this.form.value.basePartyUID ?? null,
      baseBudgetUID: this.form.value.budgetUID ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      operationSourceUID: this.form.value.operationSourceUID ?? null,
      applicationDate: this.form.value.applicationDate ?? null,
      justification: this.form.value.justification ?? null,
      baseEntityTypeUID: this.form.value.baseEntityTypeUID ?? null,
      baseEntityUID: this.form.value.baseEntityUID ?? null,
    };

    return data;
  }



  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);

      if (!disable) {
        this.validateBaseEntityFields(true);
      }
    });
  }


  private showConfirmMessage(eventType: TransactionHeaderEventType) {
    const transactionUID = this.transaction.uid;
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.transactionHeaderEvent, eventType, { transactionUID }));
  }


  private getConfirmType(eventType: TransactionHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
      case TransactionHeaderEventType.REJECT:
        return 'DeleteCancel';
      case TransactionHeaderEventType.SEND_TO_AUTHORIZE:
      case TransactionHeaderEventType.AUTHORIZE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE: return 'Eliminar transacción';
      case TransactionHeaderEventType.REJECT: return 'Rechazar transacción';
      case TransactionHeaderEventType.SEND_TO_AUTHORIZE: return 'Enviar a autorización';
      case TransactionHeaderEventType.AUTHORIZE: return 'Autorizar transacción';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
        return `Esta operación eliminará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Elimino la transacción?`;
      case TransactionHeaderEventType.REJECT:
        return `Esta operación rechazará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Rechazo la transacción?`;
      case TransactionHeaderEventType.SEND_TO_AUTHORIZE:
        return `Esta operación enviará a autorización la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Envío a autorización la transacción?`;
      case TransactionHeaderEventType.AUTHORIZE:
        return `Esta operación autorizará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Autorizo la transacción?`;
      default: return '';
    }
  }

}
