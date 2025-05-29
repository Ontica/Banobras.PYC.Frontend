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

import { CashFlowProjectionsDataService, SearcherAPIS } from '@app/data-services';

import { CashFlowProjection, CashFlowProjectionEntry, CashFlowProjectionEntryFields, EmptyCashFlowProjection,
         ProductSearch, MonthEntryFields, CashFlowProjectionEntryByYearFields,
         TransactionEntryType, FinancialAccount, CashFlowProjectionEntryBase,
         EmptyCashFlowProjectionEntryBase, CashFlowProjectionEntryByYear, MonthEntry } from '@app/models';


export enum ProjectionEntryEditorEventType {
  CLOSE_BUTTON_CLICKED = 'CashFlowProjectionEntryEditorComponent.Event.CloseButtonClicked',
  CREATE_ENTRY         = 'CashFlowProjectionEntryEditorComponent.Event.CreateEntry',
  UPDATE_ENTRY         = 'CashFlowProjectionEntryEditorComponent.Event.UpdateEntry',
}

interface ProjectionEntryFormModel extends FormGroup<{  balanceColumnUID: FormControl<string>;
  accountUID: FormControl<string>;
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
  selector: 'emp-cf-projection-entry-editor',
  templateUrl: './projection-entry-editor.component.html',
  animations: [empExpandCollapse],
})
export class CashFlowProjectionEntryEditorComponent implements OnChanges {

  @ViewChild('accountSearcher') accountSearcher: SelectBoxTypeaheadComponent;

  @Input() projection: CashFlowProjection = EmptyCashFlowProjection;

  @Input() entry: CashFlowProjectionEntryBase = EmptyCashFlowProjectionEntryBase;

  @Input() canUpdate = false;

  @Output() projectionEntryEditorEvent = new EventEmitter<EventInfo>();

  form: ProjectionEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isMonthsInvalidated = false;

  EntryType = TransactionEntryType;

  selectedEntryType = TransactionEntryType.Annually;

  accountsAPI = SearcherAPIS.cashFlowAccounts;

  productsAPI = SearcherAPIS.products;

  balanceColumnsList: Identifiable[] = [];

  monthsList: FlexibleIdentifiable[] = MONTHS_LIST;

  productUnitsList: Identifiable[] = [];

  displayCheckProductRequired: boolean = false;

  checkProductRequired: boolean = false;

  selectedProduct: Identifiable = null;

  isFormDataReady = false;

  displayedColumns = [];

  monthsFields: MonthEntryFields[] = [];

  dataSource: MatTableDataSource<string>;


  constructor(private projectionsData: CashFlowProjectionsDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.projection) {
      this.setProductControlFields();
      this.setBalanceColumnsList();
      this.buildDataTable();
    }

    if (this.isSaved && changes.entry) {
      this.enableEditor();
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.entry);
  }


  get title(): string {
    if(!this.isSaved) return 'Agregar concepto';
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} concepto`;
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
    return this.selectedEntryType === TransactionEntryType.Monthly;
  }


  get isMonthsFieldsValid(): boolean {
    if (this.isMonthlyType) {
      return true;
    }

    const months = this.monthsFields.filter(x => !!x.amount);

    return this.checkProductRequired ?
      months.length > 0 && months.every(x => x.amount > 0 && x.productQty > 0) :
      months.length > 0 && months.every(x => x.amount > 0);
  }


  get idFormReady(): boolean {
    if (!this.isSaved || this.isMonthlyType) {
      return FormHelper.isFormReady(this.form) && this.isMonthsFieldsValid;
    }

    return this.form.valid && this.isMonthsFieldsValid;
  }


  onEntryTypeChanges() {
    this.validateMonthyTypeFieldsRequired();
  }


  onAccountChanges(account: FinancialAccount) {
    // if (isEmpty(account) && !!account?.baseSegmentUID) {
    //   this.showConfirmRequestFinancialAccount(account);
    // }
  }


  onCheckProductRequiredChanges() {
    this.validateProductRequired();
    this.buildDataTable();
  }


  onProductChanges(product: ProductSearch) {
    this.selectedProduct = isEmpty(product) ? null : product;
    const baseUnit = product?.baseUnit;
    this.form.controls.productUnitUID.reset(isEmpty(baseUnit) ? null : baseUnit.uid);
    this.productUnitsList = isEmpty(baseUnit) ? [] : [baseUnit];
  }


  onMonthChanges() {
    this.invalidateMonthsFields();
  }


  onCloseButtonClicked() {
    sendEvent(this.projectionEntryEditorEvent, ProjectionEntryEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    this.invalidateForm();

    if (this.idFormReady && this.isMonthsFieldsValid) {
      const eventType = this.isSaved ? ProjectionEntryEditorEventType.UPDATE_ENTRY :
        ProjectionEntryEditorEventType.CREATE_ENTRY;

      const payload = {
        entryType: this.selectedEntryType,
        projectionUID: this.projection.uid,
        entryUID: this.isSaved ? this.entry.uid : null,
        dataFields: this.isMonthlyType ? this.getCashFlowProjectionEntryFields() : this.getCashFlowProjectionEntryByYearFields(),
      };

      sendEvent(this.projectionEntryEditorEvent, eventType, payload);
    }
  }


  private showConfirmRequestFinancialAccount(account: FinancialAccount) {
    const message = `La partida presupuestal <strong>${account.name}</strong>
      requiere autorización para ser utilizada.
      <br><br>¿Solicito la autorización?`;

    this.messageBox.confirm(message, 'Solicitar autorización')
      .firstValue()
      .then(x => {
        if (x) {
          // this.requestAccount(account.baseSegmentUID);
        } else {
          this.accountSearcher.clearValue();
        }
      });
  }


  private requestAccount(segmentUID: string) {
    // this.isLoading = true;

    // this.projectionsData.requestAccount(this.projection.uid, segmentUID)
    //   .firstValue()
    //   .then(x => {
    //     this.form.controls.accountUID.reset(x.uid);
    //     this.accountSearcher.resetListWithOption(x);
    //   })
    //   .finally(() => this.isLoading = false);
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setSelectedEntryTypeByEntry();
      this.setFormData();
    }

    this.validateFieldsRequired();
    this.validateFormDisabled();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      balanceColumnUID: ['', Validators.required],
      accountUID: ['', Validators.required],
      year: [null as number, Validators.required],
      month: [''],
      amount: [null as number],
      productUID: [''],
      productUnitUID: [''],
      productQty: [null],
      description: [''],
      justification: [''],
    });

    this.initMonthsFields();
  }


  private initMonthsFields() {
    this.monthsFields = this.monthsList.map(x => this.getInitMonthEntryField(x));
  }


  private buildDataTable() {
    this.displayedColumns = ['label', ...this.monthsFields.map(x => x.month.toString())];
    const rows = this.checkProductRequired ? ['amount', 'productQty'] : ['amount'];
    this.dataSource = new MatTableDataSource(rows);
  }


  private validateFormDisabled() {
    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateFieldsRequired() {
    this.validateMonthyTypeFieldsRequired();
    this.validateProductRequired();
  }


  private setSelectedEntryTypeByEntry() {
    this.selectedEntryType = this.entry.entryType === TransactionEntryType.Annually ?
      TransactionEntryType.Annually : TransactionEntryType.Monthly;
  }


  private setFormData() {
    this.isFormDataReady = false;

    setTimeout(() => {
      if (this.isMonthlyType) {
        this.setFormDataFromCashFlowProjectionEntry();
      } else {
        this.setFormDataFromCashFlowProjectionEntryByYear();
      }

      this.isFormDataReady = true;
      this.setBalanceColumnsList();
      this.setProductControlFields();
      this.buildDataTable();
    });
  }


  private setFormDataFromCashFlowProjectionEntry() {
    const entry = this.entry as CashFlowProjectionEntry;

    this.form.reset({
      balanceColumnUID: entry.balanceColumn.uid,
      accountUID: entry.account.uid,
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


  private setFormDataFromCashFlowProjectionEntryByYear() {
    const entry = this.entry as CashFlowProjectionEntryByYear;

    this.form.reset({
      balanceColumnUID: entry.balanceColumn.uid,
      accountUID: entry.account.uid,
      year: entry.year,
      productUID: entry.product.uid,
      productUnitUID: entry.productUnit.uid,
      description: entry.description,
      justification: entry.justification,
    });

    this.setMonthsFields(entry.amounts);
  }


  private setMonthsFields(amounts: MonthEntry[]) {
    this.monthsFields.forEach(x => {
      const data = amounts.find(a => a.month === x.month);
      if (data) {
        x.entryUID = data.entryUID;
        x.amount = data.amount;
        x.productQty = data.productQty;
      }
    })
  }


  private setProductControlFields() {
    const displayCheckProduct = false;
    // [ProductRule.Requerido, ProductRule.Opcional].includes(
    //   this.projection.classification.entriesRules.selectProduct);

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
    const balanceColumns = []; //this.projection?.classification?.entriesRules?.balanceColumns ?? [];
    this.balanceColumnsList = isEmpty(this.entry.balanceColumn) ?
      balanceColumns :
      ArrayLibrary.insertIfNotExist(balanceColumns, this.entry.balanceColumn, 'uid');
  }


  private validateMonthyTypeFieldsRequired() {
    if (this.isMonthlyType) {
      this.formHelper.setControlValidators(this.form.controls.month, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.amount, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.month);
      this.formHelper.clearControlValidators(this.form.controls.amount);
    }
  }


  private validateProductRequired() {
    if (this.checkProductRequired) {
      FormHelper.setControlValidators(this.form.controls.productUID, Validators.required);
    } else {
      FormHelper.clearControlValidators(this.form.controls.productUID);
    }
  }


  private invalidateForm() {
    this.invalidateMonthsFields();
    FormHelper.markFormControlsAsTouched(this.form);
  }


  private invalidateMonthsFields() {
    this.isMonthsInvalidated = true;
  }


  private getCashFlowProjectionEntryFields(): CashFlowProjectionEntryFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: CashFlowProjectionEntryFields = {
      balanceColumnUID: formModel.balanceColumnUID ?? '',
      accountUID: formModel.accountUID ?? '',
      year: formModel.year ?? null,
      month: formModel.month ?? '',
      amount: formModel.amount ?? null,
      productUID: this.checkProductRequired ? formModel.productUID ?? '' : null,
      productUnitUID: this.checkProductRequired ? formModel.productUnitUID ?? '' : null,
      productQty: this.checkProductRequired ? formModel.productQty ?? null : null,
      description: this.checkProductRequired ? formModel.description ?? '' : null,
      justification: formModel.justification ?? '',
    };

    return data;
  }


  private getCashFlowProjectionEntryByYearFields(): CashFlowProjectionEntryByYearFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const amounts = this.monthsFields.filter(x => x.amount > 0).map(x => this.getValidMonthEntryField(x));

    const data: CashFlowProjectionEntryByYearFields = {
      balanceColumnUID: formModel.balanceColumnUID ?? '',
      accountUID: formModel.accountUID ?? '',
      year: formModel.year ?? null,
      productUID: this.checkProductRequired ? formModel.productUID ?? '' : null,
      productUnitUID: this.checkProductRequired ? formModel.productUnitUID ?? '' : null,
      description: this.checkProductRequired ? formModel.description ?? '' : null,
      justification: formModel.justification ?? '',
      amounts,
    };

    return data;
  }


  private getInitMonthEntryField(month: FlexibleIdentifiable): MonthEntryFields {
    const data: MonthEntryFields = {
      entryUID: this.entry.uid ?? null,
      label: month.name,
      month: FormatLibrary.stringToNumber(month.uid),
      amount: null,
      productQty: null,
    };

    return data;
  }


  private getValidMonthEntryField(entry: MonthEntryFields): MonthEntryFields {
    const data: MonthEntryFields = {
      entryUID: entry.entryUID,
      month: entry.month,
      amount: entry.amount,
      productQty: this.checkProductRequired ? entry.productQty : 0,
    };

    return data;
  }

}
