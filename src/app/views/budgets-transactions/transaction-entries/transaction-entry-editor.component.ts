/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo, FlexibleIdentifiable, Identifiable, isEmpty } from '@app/core';

import { MONTHS_LIST } from '@app/core/data-types/date-string-library';

import { ArrayLibrary, empExpandCollapse, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SelectBoxTypeaheadComponent } from '@app/shared/form-controls';

import { BudgetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionEntry, BudgetTransactionEntryFields, EmptyBudgetTransaction,
         ProductSearch, ProductRule, BudgetMonthEntryFields, BudgetTransactionEntryByYearFields,
         BudgetTransactionEntryType, BudgetAccount, BudgetTransactionEntryBase,
         EmptyBudgetTransactionEntryBase, BudgetTransactionEntryByYear, BudgetMonthEntry } from '@app/models';


export enum TransactionEntryEditorEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetTransactionEntryEditorComponent.Event.CloseButtonClicked',
  CREATE_ENTRY         = 'BudgetTransactionEntryEditorComponent.Event.CreateEntry',
  UPDATE_ENTRY         = 'BudgetTransactionEntryEditorComponent.Event.UpdateEntry',
}

interface TransactionEntryFormModel extends FormGroup<{  balanceColumnUID: FormControl<string>;
  projectUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  year: FormControl<number>;
  month: FormControl<string>;
  amount: FormControl<number>;
  productUID : FormControl<string>;
  productUnitUID: FormControl<string>;
  productQty: FormControl<number>;
  description: FormControl<string>;
  justification: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-transaction-entry-editor',
  templateUrl: './transaction-entry-editor.component.html',
  animations: [empExpandCollapse],
})
export class BudgetTransactionEntryEditorComponent implements OnChanges {

  @ViewChild('budgetAccountSearcher') budgetAccountSearcher: SelectBoxTypeaheadComponent;

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() entry: BudgetTransactionEntryBase = EmptyBudgetTransactionEntryBase;

  @Input() canUpdate = false;

  @Output() transactionEntryEditorEvent = new EventEmitter<EventInfo>();

  form: TransactionEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isFormInvalidated = false;

  EntryType = BudgetTransactionEntryType;

  selectedEntryType = BudgetTransactionEntryType.Annually;

  accountsAPI = SearcherAPIS.budgetTransactionAccounts;

  projectsAPI = SearcherAPIS.projects;

  productsAPI = SearcherAPIS.products;

  balanceColumnsList: Identifiable[] = [];

  monthsList: FlexibleIdentifiable[] = MONTHS_LIST;

  productUnitsList: Identifiable[] = [];

  displayCheckProductRequired: boolean = false;

  checkProductRequired: boolean = false;

  selectedProduct: Identifiable = null;

  isFormDataReady = false;

  displayedColumns = [];

  monthsFields: BudgetMonthEntryFields[] = [];

  dataSource: MatTableDataSource<string>;


  constructor(private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction) {
      this.setProductFields();
      this.setBalanceColumnsList();
    }

    if (this.isSaved && changes.entry) {
      this.enableEditor();
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.entry);
  }


  get title(): string {
    if(!this.isSaved) return 'Agregar movimiento';
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} movimiento`;
  }


  get productUnitPlaceholder(): string {
    if (this.isSaved && !this.canUpdate) {
      return 'No proporcionado';
    }

    if (isEmpty(this.selectedProduct)){
      return 'Seleccione el producto';
    }

    return 'Seleccionar';
  }


  get isMonthlyType(): boolean {
    return this.selectedEntryType === BudgetTransactionEntryType.Monthly;
  }


  get isMonthsFieldsValid(): boolean {
    return this.isMonthlyType ? true : this.monthsFields.some(x => x.amount > 0);
  }


  onEntryTypeChanges() {
    this.validateFieldsRequired();
  }


  onBudgetAccountChanges(budgetAccount: BudgetAccount) {
    if (isEmpty(budgetAccount) && !!budgetAccount?.baseSegmentUID) {
      this.showConfirmRequestBudgetAccount(budgetAccount);
    }
  }


  onCheckProductRequiredChanges() {
    this.buildDataTable();
  }


  onProductChanges(product: ProductSearch) {
    this.selectedProduct = isEmpty(product) ? null : product;
    const baseUnit = product?.baseUnit;
    this.form.controls.productUnitUID.reset(isEmpty(baseUnit) ? null : baseUnit.uid);
    this.productUnitsList = isEmpty(baseUnit) ? [] : [baseUnit];
  }


  get idFormReady(): boolean {
    if (!this.isSaved || this.isMonthlyType) {
      return FormHelper.isFormReady(this.form) && this.isMonthsFieldsValid;
    }

    return this.form.valid && this.isMonthsFieldsValid;
  }


  onCloseButtonClicked() {
    sendEvent(this.transactionEntryEditorEvent, TransactionEntryEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    this.invalidateForm();

    if (this.idFormReady && this.isMonthsFieldsValid) {
      const eventType = this.isSaved ? TransactionEntryEditorEventType.UPDATE_ENTRY :
        TransactionEntryEditorEventType.CREATE_ENTRY;

      const payload = {
        entryType: this.selectedEntryType,
        transactionUID: this.transaction.uid,
        entryUID: this.isSaved ? this.entry.uid : null,
        dataFields: this.isMonthlyType ? this.getBudgetTransactionEntryFields() : this.getBudgetTransactionEntryByYearFields(),
      };

      sendEvent(this.transactionEntryEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setSelectedEntryTypeByEntry();
      this.setFormData();
    }

    this.validateFieldsRequired();
    this.validateFieldsDisabled();
  }


  private validateFieldsDisabled() {
    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateFieldsRequired() {
    if (this.isMonthlyType) {
      this.formHelper.setControlValidators(this.form.controls.month, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.amount, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.month);
      this.formHelper.clearControlValidators(this.form.controls.amount);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      balanceColumnUID: ['', Validators.required],
      budgetAccountUID: ['', Validators.required],
      year: [null as number, Validators.required],
      month: [''],
      amount: [null as number],
      projectUID: [''],
      productUID: [''],
      productUnitUID: [''],
      productQty: [null],
      description: [''],
      justification: [''],
    });

    this.buildMonthsFields();
    this.buildDataTable();
  }


  private buildMonthsFields() {
    this.monthsFields = this.monthsList.map(x => this.getInitBudgetMonthEntryFields(x));
  }


  private buildDataTable() {
    this.displayedColumns = ['label', ...this.monthsFields.map(x => x.month.toString())];
    const rows = this.checkProductRequired ? ['amount', 'productQty'] : ['amount'];
    this.dataSource = new MatTableDataSource(rows);
  }


  private getInitBudgetMonthEntryFields(month: FlexibleIdentifiable): BudgetMonthEntryFields {
    const data: BudgetMonthEntryFields = {
      budgetEntryUID: this.entry.uid ?? null,
      label: month.name,
      month: FormatLibrary.stringToNumber(month.uid),
      amount: null,
      productQty: null,
    };

    return data;
  }


  private setSelectedEntryTypeByEntry() {
    this.selectedEntryType = this.entry.entryType === BudgetTransactionEntryType.Annually ?
      BudgetTransactionEntryType.Annually : BudgetTransactionEntryType.Monthly;
  }


  private setFormData() {
    this.isFormDataReady = false;

    setTimeout(() => {
      if (this.isMonthlyType) {
        this.setFormDataFromBudgetTransactionEntry();
      } else {
        this.setFormDataFromBudgetTransactionEntryByYear();
      }

      this.isFormDataReady = true;
      this.setProductFields();
      this.setBalanceColumnsList();
    });
  }


  private setFormDataFromBudgetTransactionEntry() {
    const entry = this.entry as BudgetTransactionEntry;

    this.form.reset({
      balanceColumnUID: entry.balanceColumn.uid,
      projectUID: entry.project.uid,
      budgetAccountUID: entry.budgetAccount.uid,
      year: entry.year,
      month: entry.month.uid,
      amount: entry.amount > 0 ? entry.amount : null,
      productUID: entry.product.uid,
      productUnitUID: entry.productUnit.uid,
      productQty: entry.productQty > 0 ? entry.productQty : null,
      description: entry.description,
      justification: entry.justification,
    });
  }


  private setFormDataFromBudgetTransactionEntryByYear() {
    const entry = this.entry as BudgetTransactionEntryByYear;

    this.form.reset({
      balanceColumnUID: entry.balanceColumn.uid,
      projectUID: entry.project.uid,
      budgetAccountUID: entry.budgetAccount.uid,
      year: entry.year,
      productUID: entry.product.uid,
      productUnitUID: entry.productUnit.uid,
      description: entry.description,
      justification: entry.justification,
    });

    this.setMonthsFields(entry.amounts);
  }


  private setMonthsFields(amounts: BudgetMonthEntry[]) {
    this.monthsFields.forEach(x => {
      const data = amounts.find(a => a.month === x.month);
      if (data) {
        x.budgetEntryUID = data.budgetEntryUID;
        x.amount = data.amount;
        x.productQty = data.productQty;
      }
    })
  }


  private setProductFields() {
    const displayCheckProduct = [ProductRule.Requerido, ProductRule.Opcional].includes(
      this.transaction.transactionType.entriesRules.selectProduct);

    if (this.isSaved && this.isFormDataReady) {
      const hasProductData = !isEmpty(this.entry.product) || !isEmpty(this.entry.productUnit) ||
        !!this.entry.description;

      this.displayCheckProductRequired = displayCheckProduct || hasProductData;
      this.selectedProduct = isEmpty(this.entry.product) ? null : this.entry.product;
      this.productUnitsList = [this.entry.productUnit];
      this.checkProductRequired = this.displayCheckProductRequired && hasProductData;
    } else {
      this.displayCheckProductRequired = displayCheckProduct;
      this.checkProductRequired = false;
      this.isFormDataReady = !this.isSaved;
    }
  }


  private setBalanceColumnsList() {
    const balanceColumns = this.transaction?.transactionType?.entriesRules?.balanceColumns ?? [];
    this.balanceColumnsList = isEmpty(this.entry.balanceColumn) ?
      balanceColumns :
      ArrayLibrary.insertIfNotExist(balanceColumns, this.entry.balanceColumn, 'uid');
  }


  private showConfirmRequestBudgetAccount(budgetAccount: BudgetAccount) {
    const message = `La partida presupuestal <strong>${budgetAccount.name}</strong>
      requiere autorización para ser utilizada.
      <br><br>¿Solicito la autorización?`;

    this.messageBox.confirm(message, 'Solicitar autorización')
      .firstValue()
      .then(x => {
        if (x) {
          this.requestBudgetAccount(budgetAccount.baseSegmentUID);
        } else {
          this.budgetAccountSearcher.clearValue();
        }
      });
  }


  private requestBudgetAccount(segmentUID: string) {
    this.isLoading = true;

    this.transactionsData.requestBudgetAccount(this.transaction.uid, segmentUID)
      .firstValue()
      .then(x => {
        this.form.controls.budgetAccountUID.reset(x.uid);
        this.budgetAccountSearcher.resetListWithOption(x);
      })
      .finally(() => this.isLoading = false);
  }


  private invalidateForm() {
    this.isFormInvalidated = true;
    FormHelper.markFormControlsAsTouched(this.form);
  }


  private getBudgetTransactionEntryFields(): BudgetTransactionEntryFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: BudgetTransactionEntryFields = {
      balanceColumnUID: formModel.balanceColumnUID ?? '',
      budgetAccountUID: formModel.budgetAccountUID ?? '',
      year: formModel.year ?? null,
      month: formModel.month ?? '',
      amount: formModel.amount ?? null,
      projectUID: formModel.projectUID ?? '',
      productUID: this.checkProductRequired ? formModel.productUID ?? '' : null,
      productUnitUID: this.checkProductRequired ? formModel.productUnitUID ?? '' : null,
      productQty: this.checkProductRequired ? formModel.productQty ?? null : null,
      description: this.checkProductRequired ? formModel.description ?? '' : null,
      justification: formModel.justification ?? '',
    };

    return data;
  }


  private getBudgetTransactionEntryByYearFields(): BudgetTransactionEntryByYearFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const amounts = this.monthsFields.filter(x => x.amount > 0).map(x => this.getValidBudgetMonthEntryField(x));

    const data: BudgetTransactionEntryByYearFields = {
      balanceColumnUID: formModel.balanceColumnUID ?? '',
      budgetAccountUID: formModel.budgetAccountUID ?? '',
      year: formModel.year ?? null,
      projectUID: formModel.projectUID ?? '',
      productUID: this.checkProductRequired ? formModel.productUID ?? '' : null,
      productUnitUID: this.checkProductRequired ? formModel.productUnitUID ?? '' : null,
      description: this.checkProductRequired ? formModel.description ?? '' : null,
      justification: formModel.justification ?? '',
      amounts,
    };

    return data;
  }


  private getValidBudgetMonthEntryField(entry: BudgetMonthEntryFields): BudgetMonthEntryFields {
    const data: BudgetMonthEntryFields = {
      budgetEntryUID: entry.budgetEntryUID,
      month: entry.month,
      amount: entry.amount,
      productQty: this.checkProductRequired ? entry.productQty : 0,
    };

    return data;
  }

}
