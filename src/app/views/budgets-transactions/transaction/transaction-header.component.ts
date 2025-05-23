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

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SelectBoxTypeaheadComponent } from '@app/shared/form-controls';

import { BudgetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { BudgetForEdition, BudgetTransaction, BudgetTransactionFields, BudgetTypeForEdition,
         EmptyBudgetTransaction, EmptyBudgetTransactionActions, BudgetTransactionActions,
         BudgetTransactionType, BudgetTransactionRejectFields } from '@app/models';

import { ConfirmSubmitModalEventType,
         ConfirmSubmitType } from '@app/views/entity-records/confirm-submit-modal/confirm-submit-modal.component';


export enum TransactionHeaderEventType {
  CREATE            = 'BudgetTransactionHeaderComponent.Event.CreateTransaction',
  UPDATE            = 'BudgetTransactionHeaderComponent.Event.UpdateTransaction',
  DELETE            = 'BudgetTransactionHeaderComponent.Event.DeleteTransaction',
  SEND_TO_AUTHORIZE = 'BudgetTransactionHeaderComponent.Event.SendToAuthorizationTransaction',
  AUTHORIZE         = 'BudgetTransactionHeaderComponent.Event.AuthorizeTransaction',
  REJECT            = 'BudgetTransactionHeaderComponent.Event.RejectTransaction',
  CLOSE             = 'BudgetTransactionHeaderComponent.Event.CloseTransaction',
}

interface TransactionFormModel extends FormGroup<{
  basePartyUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
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

  @Input() actions: BudgetTransactionActions = EmptyBudgetTransactionActions;

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

  confirmModalMode: ConfirmSubmitType = null;

  baseEntitiesAPI = SearcherAPIS.relatedDocumentsForEdition;


  constructor(private uiLayer: PresentationLayer,
              private transactionsData: BudgetTransactionsDataService,) {
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
    return this.actions.canSendToAuthorization || this.actions.canAuthorize || this.actions.canReject ||
           this.actions.canClose || this.actions.canDelete || this.actions.canUpdate;
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


  onEventButtonClicked(mode: ConfirmSubmitType) {
    this.confirmModalMode = mode;
  }


  onConfirmSubmitModalEvent(event: EventInfo) {
    switch (event.type as ConfirmSubmitModalEventType) {
      case ConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED:
        this.confirmModalMode = null;
        return;
      case ConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED:
        const dataFields: BudgetTransactionRejectFields = { message: event.payload.notes ?? null };
        this.validateActionConfirmedToEmit(dataFields);
        this.confirmModalMode = null;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? TransactionHeaderEventType.UPDATE : TransactionHeaderEventType.CREATE;
      sendEvent(this.transactionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
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

    this.transactionsData.getOrganizationalUnitsForTransactionEdition(budgetUID, transactionTypeUID)
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
      this.baseEntitySearcher.resetListAndClearValue();
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
      justification: this.form.value.justification ?? null,
      baseEntityTypeUID: this.form.value.baseEntityTypeUID ?? null,
      baseEntityUID: this.form.value.baseEntityUID ?? null,
      applicationDate: null,
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


  private validateActionConfirmedToEmit(dataFields: BudgetTransactionRejectFields) {
    switch (this.confirmModalMode) {
      case 'Delete':
        sendEvent(this.transactionHeaderEvent, TransactionHeaderEventType.DELETE, { dataFields });
        return;
      case 'SendToAuthorization':
        sendEvent(this.transactionHeaderEvent, TransactionHeaderEventType.SEND_TO_AUTHORIZE, { dataFields });
        return;
      case 'Authorize':
        sendEvent(this.transactionHeaderEvent, TransactionHeaderEventType.AUTHORIZE, { dataFields });
        return;
      case 'Reject':
        sendEvent(this.transactionHeaderEvent, TransactionHeaderEventType.REJECT, { dataFields });
        return;
      case 'Close':
        sendEvent(this.transactionHeaderEvent, TransactionHeaderEventType.CLOSE, { dataFields });
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
