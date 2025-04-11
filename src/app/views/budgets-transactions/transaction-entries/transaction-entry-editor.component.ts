/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, FlexibleIdentifiable, Identifiable, isEmpty } from '@app/core';

import { MONTHS_LIST } from '@app/core/data-types/date-string-library';

import { ArrayLibrary, empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionEntry, BudgetTransactionEntryFields, EmptyBudgetTransaction,
         ProductSearch, EmptyBudgetTransactionEntry, ThreeStateValue } from '@app/models';


export enum TransactionEntryEditorEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetTransactionEntryEditorComponent.Event.CloseButtonClicked',
  ADD_ENTRY            = 'BudgetTransactionEntryEditorComponent.Event.AddEntry',
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

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() entry: BudgetTransactionEntry = EmptyBudgetTransactionEntry;

  @Input() canUpdate = false;

  @Output() transactionEntryEditorEvent = new EventEmitter<EventInfo>();

  form: TransactionEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

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


  constructor() {
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


  onProductChanges(product: ProductSearch) {
    this.selectedProduct = isEmpty(product) ? null : product;
    const baseUnit = product?.baseUnit;
    this.form.controls.productUnitUID.reset(isEmpty(baseUnit) ? null : baseUnit.uid);
    this.productUnitsList = isEmpty(baseUnit) ? [] : [baseUnit];
  }


  onCloseButtonClicked() {
    sendEvent(this.transactionEntryEditorEvent, TransactionEntryEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? TransactionEntryEditorEventType.UPDATE_ENTRY :
        TransactionEntryEditorEventType.ADD_ENTRY;

      const payload = {
        transactionUID: this.transaction.uid,
        entryUID: this.isSaved ? this.entry.uid : null,
        dataFields: this.getFormData()
      };

      sendEvent(this.transactionEntryEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      balanceColumnUID: ['', Validators.required],
      projectUID: [''],
      budgetAccountUID: ['', Validators.required],
      year: [null as number, Validators.required],
      month: ['', Validators.required],
      amount: [null as number, Validators.required],
      productUID: [''],
      productUnitUID: [''],
      productQty: [null],
      description: [''],
      justification: [''],
    });
  }


  private setFormData() {
    this.isFormDataReady = false;

    setTimeout(() => {
      this.form.reset({
        balanceColumnUID: this.entry.balanceColumn.uid,
        projectUID: this.entry.project.uid,
        budgetAccountUID: this.entry.budgetAccount.uid,
        year: this.entry.year,
        month: this.entry.month.uid,
        amount: this.entry.amount > 0 ? this.entry.amount : null,
        productUID: this.entry.product.uid,
        productUnitUID: this.entry.productUnit.uid,
        productQty: this.entry.productQty > 0 ? this.entry.productQty : null,
        description: this.entry.description,
        justification: this.entry.justification,
      });

      this.isFormDataReady = true;
      this.setProductFields();
      this.setBalanceColumnsList();
    });
  }


  private setProductFields() {
    const productRequired =
      this.transaction.transactionType.entriesRules.selectProduct === ThreeStateValue.True;

    if (this.isSaved && this.isFormDataReady) {
      const hasProductData = !isEmpty(this.entry.product) || !isEmpty(this.entry.productUnit) ||
        !!this.entry.description || this.entry.productQty > 0;

      this.displayCheckProductRequired = productRequired || hasProductData;
      this.selectedProduct = isEmpty(this.entry.product) ? null : this.entry.product;
      this.productUnitsList = [this.entry.productUnit];
      this.checkProductRequired = this.displayCheckProductRequired && hasProductData;
    } else {
      this.displayCheckProductRequired = productRequired;
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


  private getFormData(): BudgetTransactionEntryFields {
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

}
