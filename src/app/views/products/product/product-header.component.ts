/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ProductsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { ProductActions, Product, ProductFields, EmptyProductActions, EmptyProduct } from '@app/models';


export enum ProductHeaderEventType {
  CREATE   = 'ProductHeaderComponent.Event.CreateProduct',
  UPDATE   = 'ProductHeaderComponent.Event.UpdateProduct',
  DELETE   = 'ProductHeaderComponent.Event.DeleteProduct',
  ACTIVATE = 'RequestHeaderComponent.Event.ActivateProduct',
  SUSPEND  = 'RequestHeaderComponent.Event.SuspendProduct',
}

interface ProductFormModel extends FormGroup<{
  productCategoryUID: FormControl<string>;
  productTypeUID: FormControl<string>;
  managerUID: FormControl<string>;
  baseUnitUID: FormControl<string>;
  internalCode: FormControl<string>;
  name: FormControl<string>;
  identificators: FormControl<string[]>;
  roles: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-product-header',
  templateUrl: './product-header.component.html',
})
export class ProductHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() product: Product = EmptyProduct;

  @Input() actions: ProductActions = EmptyProductActions;

  @Output() productHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProductFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  productCategoriesList: Identifiable[] = [];

  productManagersAPI = SearcherAPIS.productManagers;

  productUnits = SearcherAPIS.productUnits;

  eventTypes = ProductHeaderEventType;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.product && this.isSaved) {
      this.enableEditor(false);
    }
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete ||
           this.actions.canActivate || this.actions.canSuspend;
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ProductHeaderEventType.UPDATE : ProductHeaderEventType.CREATE;
      sendEvent(this.productHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: ProductHeaderEventType) {
    this.showConfirmMessage(eventType);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);

    FormHelper.setDisableForm(this.form, disable);
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(ProductsStateSelector.PRODUCT_CATEGORIES)
      .subscribe(x => {
        this.productCategoriesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      productCategoryUID: ['', Validators.required],
      productTypeUID: [''],
      internalCode: ['', Validators.required],
      name: ['', Validators.required],
      managerUID: ['', Validators.required],
      baseUnitUID: ['', Validators.required],
      identificators: [null],
      roles: [null],
      tags: [null],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        productCategoryUID: isEmpty(this.product.productCategory) ? '' : this.product.productCategory.uid,
        productTypeUID: isEmpty(this.product.productType) ? '' : this.product.productType.uid,
        internalCode: this.product.internalCode ?? '',
        name: this.product.name ?? '',
        managerUID: isEmpty(this.product.manager) ? '' : this.product.manager.uid,
        baseUnitUID: isEmpty(this.product.baseUnit) ? '' : this.product.baseUnit.uid,
        identificators: this.product.identificators ?? [],
        tags: this.product.tags ?? [],
        description: this.product.description ?? '',
      });
    });
  }


  private getFormData(): ProductFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: ProductFields = {
      productCategoryUID: this.form.value.productCategoryUID ?? null,
      internalCode: this.form.value.internalCode ?? null,
      name: this.form.value.name ?? null,
      description: this.form.value.description ?? null,
      identificators: this.form.value.identificators ?? null,
      tags: this.form.value.tags ?? null,
      roles: [],
      baseUnitUID: this.form.value.baseUnitUID ?? null,
      managerUID: this.form.value.managerUID ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: ProductHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: ProductHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case ProductHeaderEventType.DELETE:
      case ProductHeaderEventType.SUSPEND:
        return 'DeleteCancel';
      case ProductHeaderEventType.ACTIVATE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: ProductHeaderEventType): string {
    switch (eventType) {
      case ProductHeaderEventType.DELETE: return 'Eliminar producto';
      case ProductHeaderEventType.SUSPEND: return 'Suspender producto';
      case ProductHeaderEventType.ACTIVATE: return 'Reactivar producto';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: ProductHeaderEventType): string {
    const productName = !this.product.internalCode ? this.product.name :
      `${this.product.internalCode}: ${this.product.name}`;

    switch (eventType) {
      case ProductHeaderEventType.DELETE:
        return `Esta operación eliminará el producto <strong>${productName}</strong>
                (${this.product.productType.name}).
                <br><br>¿Elimino el producto?`;

      case ProductHeaderEventType.SUSPEND:
        return `Esta operación suspenderá el producto <strong>${productName}</strong>
                (${this.product.productType.name}).
                <br><br>¿Suspendo el producto?`;

      case ProductHeaderEventType.ACTIVATE:
        return `Esta operación reactivará el producto <strong>${productName}</strong>
                (${this.product.productType.name}).
                <br><br>¿Reactivo el producto?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: ProductHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.productHeaderEvent, eventType, { productUID: this.product.uid });
    }
  }

}
