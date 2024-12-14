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

import { BudgetingStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { ProductBudgetSegment, EmptyProductBudgetSegment, ProductBudgetSegmentFields } from '@app/models';


export enum ProductBudgetSegmentEditorEventType {
  CLOSE_BUTTON_CLICKED = 'ProductBudgetSegmentEditorComponent.Event.CloseButtonClicked',
  ADD_ITEM             = 'ProductBudgetSegmentEditorComponent.Event.AddItem',
  UPDATE_ITEM          = 'ProductBudgetSegmentEditorComponent.Event.UpdateItem',
}

interface ProductBudgetSegmentFormModel extends FormGroup<{
  budgetTypeUID: FormControl<string>;
  budgetSegmentUID: FormControl<string>;
  observations: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-product-budget-segment-editor',
  templateUrl: './product-budget-segment-editor.component.html',
})
export class ProductBudgetSegmentEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() productUID = '';

  @Input() canUpdate = false;

  @Input() item: ProductBudgetSegment = EmptyProductBudgetSegment;

  @Output() productBudgetSegmentEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProductBudgetSegmentFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  budgetTypesList: Identifiable[] = [];

  productBudgetSegments = SearcherAPIS.productBudgetSegments;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.isSaved && changes.item) {
      this.enableEditor();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.item);
  }


  onCloseButtonClicked() {
    sendEvent(this.productBudgetSegmentEditorEvent, ProductBudgetSegmentEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onBudgetTypeChanges() {
    this.form.controls.budgetSegmentUID.reset();
    this.validateBudgetSegmentDisabled();
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ProductBudgetSegmentEditorEventType.UPDATE_ITEM :
        ProductBudgetSegmentEditorEventType.ADD_ITEM;

      const payload = {
        productUID: this.productUID,
        productBudgetSegmentUID: this.isSaved ? this.item.uid : null,
        dataFields: this.getFormData()
      };

      sendEvent(this.productBudgetSegmentEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateBudgetSegmentDisabled() {
    const disable = !this.productUID || !this.form.value.budgetTypeUID;
    FormHelper.setDisableControl(this.form.controls.budgetSegmentUID, disable);
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(BudgetingStateSelector.BUDGET_TYPES)
      .subscribe(x => {
        this.budgetTypesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      budgetTypeUID: ['', Validators.required],
      budgetSegmentUID: ['', Validators.required],
      observations: [''],
    });

    this.validateBudgetSegmentDisabled();
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        budgetTypeUID: isEmpty(this.item.budgetType) ? null : this.item.budgetType.uid,
        budgetSegmentUID: isEmpty(this.item.budgetSegment) ? null : this.item.budgetSegment.uid,
        observations: this.item.observations ?? null,
      });

      this.validateBudgetSegmentDisabled();
    });
  }


  private getFormData(): ProductBudgetSegmentFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ProductBudgetSegmentFields = {
      budgetSegmentUID: formModel.budgetSegmentUID ?? '',
      observations: formModel.observations ?? '',
    };

    return data;
  }

}
