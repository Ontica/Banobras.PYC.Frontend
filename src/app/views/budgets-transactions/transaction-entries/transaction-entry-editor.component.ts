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

import { Assertion, EventInfo, FlexibleIdentifiable, Identifiable, isEmpty } from '@app/core';

import { MONTHS_LIST } from '@app/core/data-types/date-string-library';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { ProductsDataService, SearcherAPIS } from '@app/data-services';

import { BudgetAccountsForProductQuery, BudgetTransaction, BudgetTransactionEntry,
         BudgetTransactionEntryFields, EmptyBudgetTransaction, ProductSearch, RequestsList,
         EmptyBudgetTransactionEntry, BudgetEntryTypesList, BudgetEntryTypes } from '@app/models';


export enum TransactionEntryEditorEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetTransactionEntryEditorComponent.Event.CloseButtonClicked',
  ADD_ENTRY            = 'BudgetTransactionEntryEditorComponent.Event.AddEntry',
  UPDATE_ENTRY         = 'BudgetTransactionEntryEditorComponent.Event.UpdateEntry',
}

interface TransactionEntryFormModel extends FormGroup<{
  balanceColumnUID: FormControl<string>;
  partyUID: FormControl<string>;
  productUID : FormControl<string>;
  productUnitUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  year: FormControl<number>;
  month: FormControl<string>;
  currencyUID: FormControl<string>;
  amount: FormControl<number>; // Deposit || Withdrawal
  productQty: FormControl<number>;
  projectUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-transaction-entry-editor',
  templateUrl: './transaction-entry-editor.component.html',
})
export class BudgetTransactionEntryEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() entry: BudgetTransactionEntry = EmptyBudgetTransactionEntry;

  @Input() canUpdate = false;

  @Output() transactionEntryEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: TransactionEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingBudgetAccounts = false;

  projectsAPI = SearcherAPIS.projects;

  productsAPI = SearcherAPIS.products;

  budgetEntryTypesList: Identifiable[] = BudgetEntryTypesList;

  orgUnitsList: Identifiable[] = [];

  monthsList: FlexibleIdentifiable[] = MONTHS_LIST;

  currenciesList: Identifiable[] = [];

  productUnitsList: Identifiable[] = [];

  budgetAccountsList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private productsData: ProductsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.isSaved && changes.entry) {
      this.enableEditor();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.entry);
  }


  get title(): string {
    if(!this.isSaved) return 'Agregar movimiento';
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} movimiento`;
  }


  get selectionPlaceholder(): string {
    return this.isSaved && !this.canUpdate ? 'No proporcionado' : 'Seleccionar';
  }


  get budgetAccountPlaceholder(): string {
    if (this.form.controls.partyUID.invalid) {
      return 'Seleccione area';
    }

    return this.selectionPlaceholder;
  }


  onPartyChanges(orgUnit: Identifiable) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
  }


  onProductChanges(product: ProductSearch) {
    this.form.controls.productUnitUID.reset(isEmpty(product.baseUnit) ? null : product.baseUnit.uid);
    this.form.controls.budgetAccountUID.reset(null);
    this.productUnitsList = isEmpty(product.baseUnit) ? [] : [product.baseUnit];
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
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


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.budgeting }),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.currenciesList = b;
      this.isLoading = a.length === 0;
    });
  }


  private validateSearchBudgetAccounts(budgetAccountsDefault?: Identifiable) {
    const budgetUID = this.transaction.budget.uid;
    const orgUnitUID = this.form.value.partyUID;
    const productUID = this.form.value.productUID;

    if (!!budgetUID && !!orgUnitUID && !!productUID) {
      const query: BudgetAccountsForProductQuery = { budgetUID, orgUnitUID, productUID };
      this.searchBudgetAccounts(productUID, query, budgetAccountsDefault);
    } else {
      this.setBudgetAccountsList([], budgetAccountsDefault);
    }
  }


  private searchBudgetAccounts(productUID: string,
                               query: BudgetAccountsForProductQuery,
                               budgetAccountsDefault?: Identifiable) {
    this.isLoadingBudgetAccounts = true;

    this.productsData.searchBudgetAccountsForProduct(productUID, query)
    .firstValue()
      .then(x => this.setBudgetAccountsList(x, budgetAccountsDefault))
      .finally(() => this.isLoadingBudgetAccounts = false);
  }


  private setBudgetAccountsList(dataList: Identifiable[], budgetAccountsDefault?: Identifiable) {
    this.budgetAccountsList = isEmpty(budgetAccountsDefault) ?
      dataList :
      ArrayLibrary.insertIfNotExist(dataList, budgetAccountsDefault, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      balanceColumnUID: ['', Validators.required],
      partyUID: ['', Validators.required],
      productUID: ['', Validators.required],
      productUnitUID: ['', Validators.required],
      budgetAccountUID: ['', Validators.required],
      year: [null as number, Validators.required],
      month: ['', Validators.required],
      currencyUID: ['', Validators.required],
      amount: [null as number, Validators.required],
      productQty: [null as number, Validators.required],
      projectUID: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    // setTimeout(() => {
    //   this.form.reset({
    //     balanceColumnUID: this.entry.balanceColumnUID,
    //     budgetAccountUID: this.entry.budgetAccountUID,
    //     year: this.entry.year,
    //     month: this.entry.month,
    //     currencyUID: this.entry.currencyUID,
    //     amount: this.entry.amount,
    //     productUID: this.entry.productUID,
    //     productUnitUID: this.entry.productUnitUID,
    //     productQty: this.entry.productQty,
    //     projectUID: this.entry.projectUID,
    //     partyUID: this.entry.partyUID,
    //     description: this.entry.description,
    //   });

    //   this.productUnitsList = [this.entry.productUnit];
    //   this.validateSearchBudgetAccounts(this.entry.budgetAccount);
    // });
  }


  private getFormData(): BudgetTransactionEntryFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const budgetEntryType = formModel.balanceColumnUID ?? '';
    const isDebit = budgetEntryType === BudgetEntryTypes.Debit;
    const isCredit = budgetEntryType === BudgetEntryTypes.Credit;

    const data: BudgetTransactionEntryFields = {
      balanceColumnUID: budgetEntryType,
      budgetAccountUID: formModel.budgetAccountUID ?? '',
      currencyUID: formModel.currencyUID ?? '',
      year: formModel.year ?? null,
      month: formModel.month ?? '',
      deposit: isDebit ? formModel.amount : null,
      withdrawal: isCredit ? formModel.amount : null,
      partyUID: formModel.partyUID ?? '',
      projectUID: formModel.projectUID ?? '',
      productUID: formModel.productUID ?? '',
      productUnitUID: formModel.productUnitUID ?? '',
      productQty: formModel.productQty ?? null,
      description: formModel.description ?? '',
    };

    return data;
  }

}
