/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector } from '@app/presentation/exported.presentation.types';

import { PERMISSIONS } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { ImportBudgetTransactionsResult, ImportBudgetTransactionsCommand, EmptyImportBudgetTransactionsResult,
         BudgetTypeForEdition, BudgetForEdition, BudgetTransactionType } from '@app/models';


export enum TransactionsImporterEventType {
  CLOSE_MODAL_CLICKED = 'BudgetTransactionsImporterComponent.Event.CloseModalClicked',
  DATA_IMPORTED       = 'BudgetTransactionsImporterComponent.Event.DataImported',
}

interface TransactionsImporterFormModel extends FormGroup<{
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
  applicationDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-bdg-transactions-importer',
  templateUrl: './transactions-importer.component.html',
})
export class BudgetTransactionsImporterComponent implements OnInit, OnDestroy {

  @Output() transactionsImporterEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  title = 'Importador de transacciones';

  file = null;

  form: TransactionsImporterFormModel;

  formHelper = FormHelper;

  isFormInvalidated = false;

  submitted = false;

  isLoading = false;

  budgetTypesList: BudgetTypeForEdition[] = [];

  budgetsList: BudgetForEdition[] = [];

  transactionTypesList: BudgetTransactionType[] = [];

  operationSourcesList: Identifiable[] = [];

  importResult: ImportBudgetTransactionsResult = EmptyImportBudgetTransactionsResult;

  executedDryRun = false;

  executedImported = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  get isFileFormValid(): boolean {
    return this.form.valid && this.file;
  }


  get isReadyForSubmit(): boolean {
    return this.executedDryRun && !this.executedImported &&
           this.isFileFormValid && !this.importResult.hasErrors && this.importResult.transactionsCount > 0;
  }


  onCloseModalClicked() {
    sendEvent(this.transactionsImporterEvent, TransactionsImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onFileControlChange(file) {
    this.file = file;
    this.resetImportResult();
  }


  onBudgetTypeChanged(budgetType: BudgetTypeForEdition) {
    this.form.controls.budgetUID.reset();
    this.form.controls.transactionTypeUID.reset();
    this.form.controls.operationSourceUID.reset();
    this.budgetsList = budgetType?.budgets ?? [];
    this.transactionTypesList = [];
    this.operationSourcesList = []
  }


  onBudgetChanged(budget: BudgetForEdition) {
    this.form.controls.transactionTypeUID.reset();
    this.form.controls.operationSourceUID.reset();
    this.transactionTypesList = budget?.transactionTypes ?? [];
    this.operationSourcesList = [];
  }


  onTransactionTypeChanged(transactionType: BudgetTransactionType) {
    this.form.controls.operationSourceUID.reset();
    this.operationSourcesList = transactionType?.operationSources ?? [];
  }


  onSubmitDryRunImportTransactions() {
    if (this.setAndReturnIsFormInvalidated() || this.executedDryRun) {
      return;
    }

    this.importTransactions(true);
  }


  onSubmitImportTransactions() {
    if (this.hasErrorSubmitImport()) {
      return;
    }

    this.showConfirmImportMessage();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<BudgetTypeForEdition[]>(BudgetingStateSelector.BUDGET_TYPES_FOR_EDITION)
      .subscribe(x => {
        this.budgetTypesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      transactionTypeUID: ['', Validators.required],
      operationSourceUID: ['', Validators.required],
      applicationDate: [null as DateString, Validators.required],
    });

    this.form.valueChanges.subscribe(v => this.resetImportResult());
  }


  private resetImportResult() {
    if (this.executedImported) {
      return;
    }

    this.executedDryRun = false;
    this.executedImported = false
    this.importResult = EmptyImportBudgetTransactionsResult;
  }


  private hasErrorSubmitImport(): boolean {
    if (this.setAndReturnIsFormInvalidated() || !this.isReadyForSubmit || this.importResult.hasErrors) {
      this.showErrorMessage();
      return true;
    }

    return false;
  }


  private setAndReturnIsFormInvalidated(): boolean {
    this.isFormInvalidated = this.isFileFormValid ? false :
      !this.formHelper.isFormReadyAndInvalidate(this.form) || !this.file;

    return this.isFormInvalidated;
  }


  private showErrorMessage() {
    if (!this.executedDryRun) {
      return;
    }

    if (this.importResult.hasErrors) {
      this.messageBox.showError('Se encontraron errores en los datos.');
    }
  }


  private showConfirmImportMessage() {
    this.messageBox.confirm(this.getConfirmImportMessage(), this.title)
      .firstValue()
      .then(x => x ? this.importTransactions(false) : null);
  }


  private getConfirmImportMessage(): string {
    const transactionsCount = FormatLibrary.numberWithCommas(this.importResult.transactionsCount);
    const partsToImport = '<ul class="info-list">' +
      this.importResult.transactionTotals.map(x => '<li>' + x.description + '</li>').join('') + '</ul>';

    return `Esta operación importará ` +
      `<strong>${transactionsCount} transacciones</strong> ` +
      `desde: <br><br>${partsToImport} <br>¿Importo las transacciones?`;
  }


  private getFormData(dryRun: boolean): ImportBudgetTransactionsCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ImportBudgetTransactionsCommand = {
      dryRun: dryRun,
      budgetTypeUID: formModel.budgetTypeUID,
      budgetUID: formModel.budgetUID,
      transactionTypeUID: formModel.transactionTypeUID,
      operationSourceUID: formModel.operationSourceUID,
      applicationDate: formModel.applicationDate,
    };

    return data;
  }


  private importTransactions(dryRun: boolean) {
    this.submitted = true;

    const command = this.getFormData(dryRun);

    this.transactionsData.importTransactions(this.file.file, command)
      .firstValue()
      .then(x => this.resolveImportTransactions(x, dryRun))
      .finally(() => this.submitted = false);
  }


  private resolveImportTransactions(result: ImportBudgetTransactionsResult, isDryRun: boolean) {
    this.importResult = result;

    if (isDryRun) {
      this.resolveDryRunResponse();
    } else {
      this.resolveImportResponse();
    }
  }


  private resolveDryRunResponse() {
    this.executedDryRun = true;

    if (this.importResult.hasErrors) {
      this.showImportResultErrorMessage();
    }
  }


  private resolveImportResponse() {
    if (this.importResult.hasErrors) {
      this.showImportResultErrorMessage();
    } else {
      this.executedImported = true;
      this.formHelper.setDisableForm(this.form);
      this.showImportResultSuccessMessage();
      sendEvent(this.transactionsImporterEvent, TransactionsImporterEventType.DATA_IMPORTED);
    }
  }


  private showImportResultSuccessMessage() {
    const message = `Se han importado <strong>${this.importResult.transactionsCount} transacciones</strong>.`;
    this.messageBox.show(message, this.title);
  }


  private showImportResultErrorMessage() {
    const message = `No es posible realizar la importación, ya que se detectaron ` +
      `<strong>${this.importResult.errors.length} errores</strong> en el archivo.`;
    this.messageBox.showError(message);
  }

}
