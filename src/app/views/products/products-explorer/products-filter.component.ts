/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ProductsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { EmptyProductsQuery, ProductsQuery, ProductsStatus, ProductStatus,
         ProductStatusList } from '@app/models';


export enum ProductsFilterEventType {
  SEARCH_CLICKED = 'ProductsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ProductsFilterComponent.Event.ClearClicked',
}

interface ProductsFilterFormModel extends FormGroup<{
  productCategoryUID: FormControl<string>;
  productTypeUID: FormControl<string>;
  status: FormControl<ProductsStatus>;
  keywords: FormControl<string>;
  managerUID: FormControl<string>;
  internalCode: FormControl<string>;
  tags: FormControl<string[]>;
}> { }


@Component({
  selector: 'emp-ng-products-filter',
  templateUrl: './products-filter.component.html',
  animations: [empExpandCollapse],
})
export class ProductsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: ProductsQuery = Object.assign({}, EmptyProductsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() productsFilterEvent = new EventEmitter<EventInfo>();

  form: ProductsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: ProductStatus[] = ProductStatusList;

  productCategoriesList: Identifiable[] = [];

  productTypesList: Identifiable[] = [];

  productManagersAPI = SearcherAPIS.productManagers;

  selectedProductManager: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onProductManagerChanges(manager: Identifiable) {
    this.selectedProductManager = manager;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.productsFilterEvent, ProductsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.productsFilterEvent, ProductsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(ProductsStateSelector.PRODUCT_TYPES),
      this.helper.select<Identifiable[]>(ProductsStateSelector.PRODUCT_CATEGORIES),
    ])
    .subscribe(([a, b]) => {
      this.productTypesList = a;
      this.productCategoriesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      productCategoryUID: [null],
      productTypeUID: [null],
      status: [null],
      keywords: [null],
      internalCode: [null],
      tags: [null],
      managerUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      productCategoryUID: this.query.productCategoryUID,
      productTypeUID: this.query.productTypeUID,
      status: this.query.status,
      keywords: this.query.keywords,
      internalCode: this.query.internalCode,
      tags: this.query.tags,
      managerUID: this.query.managerUID,
    });
  }


  private getFormData(): ProductsQuery {
    const query: ProductsQuery = {
      productCategoryUID: this.form.value.productCategoryUID ?? null,
      productTypeUID: this.form.value.productTypeUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      internalCode: this.form.value.internalCode ?? null,
      tags: this.form.value.tags ?? null,
      managerUID: this.form.value.managerUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
