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

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { Budget, BudgetAccountsForProductQuery, Contract, ContractItem, ContractItemFields, EmptyContract,
         EmptyContractItem, ProductSearch, RequestsList } from '@app/models';


export enum ContractItemEditorEventType {
  CLOSE_BUTTON_CLICKED = 'ContractItemEditorComponent.Event.CloseButtonClicked',
  ADD_ITEM             = 'ContractItemEditorComponent.Event.AddItem',
  UPDATE_ITEM          = 'ContractItemEditorComponent.Event.UpdateItem',
}

interface ContractItemFormModel extends FormGroup<{
  contractItemTypeUID: FormControl<string>;
  requisitionItemUID: FormControl<string>;
  requesterOrgUnitUID: FormControl<string>;
  supplierUID: FormControl<string>;
  budgetUID: FormControl<string>;
  periodicityTypeUID: FormControl<string>;
  productUID: FormControl<string>;
  productUnitUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  projectUID: FormControl<string>;
  minQuantity: FormControl<string>;
  maxQuantity: FormControl<string>;
  unitPrice: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-contract-item-editor',
  templateUrl: './contract-item-editor.component.html',
})
export class ContractItemEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() contract: Contract = EmptyContract;

  @Input() canUpdate = false;

  @Input() item: ContractItem = EmptyContractItem;

  @Output() contractItemEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ContractItemFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingBudgetAccounts = false;

  projectsAPI = SearcherAPIS.projects;

  productsAPI = SearcherAPIS.products;

  orgUnitsList: Identifiable[] = [];

  suppliersList: Identifiable[] = [];

  periodicityTypesList: Identifiable[] = [];

  productUnitsList: Identifiable[] = [];

  budgetAccountsList: Identifiable[] = [];

  isOrgUnitRequired = false;

  isSupplierRequired = false;


  constructor(private uiLayer: PresentationLayer,
              private budgetData: BudgetTransactionsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
    this.initSupplierList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.isSaved && changes.item) {
      this.enableEditor();
    }

    this.validateFieldsRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.item);
  }


  get title(): string {
    if(!this.isSaved) return 'Agregar concepto';
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} concepto`;
  }


  get selectionPlaceholder(): string {
    return this.isSaved && !this.canUpdate ? 'No proporcionado' : 'Seleccionar';
  }


  get budgetAccountPlaceholder(): string {
    if (this.form.controls.budgetUID.invalid) {
      return 'Seleccione el presupuesto';
    }

    if (this.form.controls.productUID.invalid) {
      return 'Seleccione el producto';
    }

    return this.selectionPlaceholder;
  }


  onRequesterOrgUnitChanges(orgUnit: Identifiable) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
  }


  onBudgetChanges(budget: Budget) {
    this.form.controls.budgetAccountUID.reset(null);
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
    sendEvent(this.contractItemEditorEvent, ContractItemEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ContractItemEditorEventType.UPDATE_ITEM :
        ContractItemEditorEventType.ADD_ITEM;

      const payload = {
        contractUID: this.contract.uid,
        contractItemUID: this.isSaved ? this.item.uid : null,
        dataFields: this.getFormData()
      };

      sendEvent(this.contractItemEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateFieldsRequired() {
    this.setValuesRequired();
    this.validateControlRequired(this.form.controls.requesterOrgUnitUID, this.isOrgUnitRequired);
    this.validateControlRequired(this.form.controls.supplierUID, this.isSupplierRequired);
  }


  private setValuesRequired() {
    this.isOrgUnitRequired = this.contract.isForMultipleOrgUnits;
    this.isSupplierRequired = this.contract.suppliersGroup.length > 0;

    if (!this.isSaved) {
      this.form.controls.requesterOrgUnitUID.reset(
        this.isOrgUnitRequired ? this.contract.managedByOrgUnit.uid : null);
      this.form.controls.supplierUID.reset(
        this.isSupplierRequired ? this.contract.suppliersGroup[0].uid : null);
    }
  }


  private validateControlRequired(control, required: boolean) {
    FormHelper.setDisableControl(control, !required);

    if (required) {
      FormHelper.setControlValidators(control, Validators.required);
    } else {
      FormHelper.clearControlValidators(control);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.contracts }),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.PERIODICITY_TYPES),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.periodicityTypesList = b;
      this.isLoading = a.length === 0;
    });
  }


  private validateSearchBudgetAccounts(budgetAccountsDefault?: Identifiable) {
    const operationType = 'procurement';
    const baseBudgetUID = this.form.value.budgetUID;
    const basePartyUID = this.isOrgUnitRequired ?
      this.form.value.requesterOrgUnitUID : this.contract.managedByOrgUnit.uid;
    const productUID = this.form.value.productUID;

    if (!!baseBudgetUID && !!basePartyUID && !!productUID) {
      const query: BudgetAccountsForProductQuery = { operationType, baseBudgetUID, basePartyUID, productUID };
      this.searchBudgetAccounts(query, budgetAccountsDefault);
    } else {
      this.setBudgetAccountsList([], budgetAccountsDefault);
    }
  }


  private searchBudgetAccounts(query: BudgetAccountsForProductQuery,
                               budgetAccountsDefault?: Identifiable) {
    this.isLoadingBudgetAccounts = true;

    this.budgetData.searchBudgetAccounts(query)
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
      contractItemTypeUID: [null],
      requisitionItemUID: [null],
      requesterOrgUnitUID: [''],
      supplierUID: [''],
      budgetUID: ['', Validators.required],
      productUID: ['', Validators.required],
      budgetAccountUID: ['', Validators.required],
      productUnitUID: ['', Validators.required],
      periodicityTypeUID: ['', Validators.required],
      projectUID: [''],
      unitPrice: ['', Validators.required],
      minQuantity: ['', Validators.required],
      maxQuantity: ['', Validators.required],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      let supplierUID = null;

      if (!isEmpty(this.item.supplier)) {
        supplierUID = this.item.supplier.uid;
      } else {
        supplierUID = !isEmpty(this.contract.supplier) ? this.contract.supplier.uid : null;
      }

      this.form.reset({
        contractItemTypeUID: isEmpty(this.item.contractItemType) ? null : this.item.contractItemType.uid,
        requisitionItemUID: null,
        requesterOrgUnitUID: isEmpty(this.item.requesterOrgUnit) ? null : this.item.requesterOrgUnit.uid,
        supplierUID: supplierUID,
        budgetUID: isEmpty(this.item.budget) ? null : this.item.budget.uid,
        productUID: isEmpty(this.item.product) ? null : this.item.product.uid,
        productUnitUID: isEmpty(this.item.productUnit) ? null : this.item.productUnit.uid,
        budgetAccountUID: isEmpty(this.item.budgetAccount) ? null : this.item.budgetAccount.uid,
        projectUID: isEmpty(this.item.project) ? null : this.item.project.uid,
        periodicityTypeUID: isEmpty(this.item.periodicityType) ? null : this.item.periodicityType.uid,
        minQuantity: this.item.minQuantity >= 0 ? FormatLibrary.numberWithCommas(this.item.minQuantity) : null,
        maxQuantity: this.item.maxQuantity >= 0 ? FormatLibrary.numberWithCommas(this.item.maxQuantity) : null,
        description: this.item.description,
        unitPrice: this.item.unitPrice >= 0 ? FormatLibrary.numberWithCommas(this.item.unitPrice) : null,
      });

      this.productUnitsList = [this.item.productUnit];
      this.initSupplierList();
      this.validateSearchBudgetAccounts(this.item.budgetAccount);
    });
  }


  private initSupplierList() {
    if (this.contract.suppliersGroup.length > 0) {
      this.suppliersList = this.contract.suppliersGroup;
    } else if (!isEmpty(this.item.supplier)) {
      this.suppliersList = [this.item.supplier];
    } else if (!isEmpty(this.contract.supplier)) {
      this.suppliersList = [this.contract.supplier];
    }
  }


  private getFormData(): ContractItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ContractItemFields = {
      contractItemTypeUID: formModel.contractItemTypeUID ?? '',
      requisitionItemUID: formModel.requisitionItemUID ?? '',
      requesterOrgUnitUID: formModel.requesterOrgUnitUID ?? '',
      supplierUID: formModel.supplierUID ?? '',
      budgetUID: formModel.budgetUID ?? '',
      productUID: formModel.productUID ?? '',
      productUnitUID: formModel.productUnitUID ?? '',
      budgetAccountUID: formModel.budgetAccountUID ?? '',
      projectUID: formModel.projectUID ?? '',
      periodicityTypeUID: formModel.periodicityTypeUID ?? '',
      minQuantity: FormatLibrary.stringToNumber(formModel.minQuantity),
      maxQuantity: FormatLibrary.stringToNumber(formModel.maxQuantity),
      unitPrice: FormatLibrary.stringToNumber(formModel.unitPrice),
      description: formModel.description ?? '',
    };

    return data;
  }

}
