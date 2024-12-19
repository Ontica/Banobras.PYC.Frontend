/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { OrdersDataService, SearcherAPIS } from '@app/data-services';

import { OrderActions, Order, OrderFields, EmptyOrderActions, EmptyOrder, Priority, PriorityList,
         OrderTypeConfig, EmptyOrderTypeConfig, ObjectTypes, PayableOrder, PayableOrderFields,
         BudgetType } from '@app/models';


export enum OrderHeaderEventType {
  CREATE = 'OrderHeaderComponent.Event.CreateOrder',
  UPDATE = 'OrderHeaderComponent.Event.UpdateOrder',
  DELETE = 'OrderHeaderComponent.Event.DeleteOrder',
}

interface OrderFormModel extends FormGroup<{
  categoryUID: FormControl<string>;
  priority: FormControl<Priority>;
  responsibleUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  beneficiaryUID: FormControl<string>;
  providerUID: FormControl<string>;
  isForMultipleBeneficiaries: FormControl<boolean>;
  projectUID: FormControl<string>;
  identificators: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  currencyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-order-header',
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent implements OnChanges, OnDestroy {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() isSaved = false;

  @Input() order: Order = EmptyOrder;

  @Input() actions: OrderActions = EmptyOrderActions;

  @Output() orderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: OrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  prioritiesList: Identifiable[] = PriorityList;

  budgetTypesList: Identifiable[] = [];

  budgetsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  suppliersAPI = SearcherAPIS.suppliers;

  projectsAPI = SearcherAPIS.projects;

  Priority = Priority;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.config) {
      this.loadDataLists();
      this.validateFieldsRequired();
    }

    if (changes.order && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete;
  }


  get isPayableOrder(): boolean {
    return this.config.orderType === ObjectTypes.PayableOrder;
  }


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.form.controls.budgetUID.reset();
    this.budgetsList = budgetType?.budgets ?? [];
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = OrderHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = OrderHeaderEventType.UPDATE;
      }

      sendEvent(this.orderHeaderEvent, eventType, { dataFields: this.getOrderFields() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(OrderHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    if (!this.config.requestsList) {
      this.orgUnitsList = [];
      return;
    }

    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.config.requestsList }),
      this.ordersData.getOrderCategories(this.config.orderType),
      this.helper.select<Identifiable[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.categoriesList = b;
      this.budgetTypesList = c;
      this.currenciesList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      categoryUID: ['', Validators.required],
      priority: [null as Priority, Validators.required],
      responsibleUID: ['', Validators.required],
      requestedByUID: ['', Validators.required],
      beneficiaryUID: ['', Validators.required],
      providerUID: ['', Validators.required],
      isForMultipleBeneficiaries: [false],
      projectUID: [''],
      identificators: [null],
      tags: [null],
      description: [''],
      budgetTypeUID: [''],
      budgetUID: [''],
      currencyUID: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        categoryUID: isEmpty(this.order.category) ? null : this.order.category.uid,
        priority: isEmpty(this.order.priority) ? null : this.order.priority.uid as Priority,
        responsibleUID: isEmpty(this.order.responsible) ? null : this.order.responsible.uid,
        requestedByUID: isEmpty(this.order.requestedBy) ? null : this.order.requestedBy.uid,
        beneficiaryUID: isEmpty(this.order.beneficiary) ? null : this.order.beneficiary.uid,
        providerUID: isEmpty(this.order.provider) ? null : this.order.provider.uid,
        isForMultipleBeneficiaries: this.order.isForMultipleBeneficiaries,
        projectUID: isEmpty(this.order.project) ? null : this.order.project.uid,
        identificators: this.order.identificators ?? null,
        tags: this.order.tags ?? null,
        description: this.order.description ?? null,
      });

      this.validateSetOrderFields();
    });
  }


  private validateSetOrderFields() {
    if (this.isPayableOrder) {
      const payableOrder = this.order as PayableOrder;
      this.form.controls.budgetTypeUID.reset(isEmpty(payableOrder.budgetType) ? null : payableOrder.budgetType.uid);
      this.form.controls.budgetUID.reset(isEmpty(payableOrder.budget) ? null : payableOrder.budget.uid);
      this.form.controls.currencyUID.reset(isEmpty(payableOrder.currency) ? null : payableOrder.currency.uid);
    }
  }


  private validateFieldsRequired() {
    if (this.isPayableOrder) {
      this.formHelper.setControlValidators(this.form.controls.budgetTypeUID, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.budgetUID, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.currencyUID, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.budgetTypeUID);
      this.formHelper.clearControlValidators(this.form.controls.budgetUID);
      this.formHelper.clearControlValidators(this.form.controls.currencyUID);
    }

    setTimeout(() => FormHelper.markControlsAsUntouched(this.form.controls.providerUID));
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private getOrderFields(): OrderFields {
    switch (this.config.orderType) {
      case ObjectTypes.PayableOrder: return this.getPayableOrderFields();
    default:
        throw Assertion.assertNoReachThisCode(`Unhandled order type: ${this.config.orderType}.`);
    }
  }


  private getPayableOrderFields(): PayableOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PayableOrderFields = {
      orderTypeUID: this.config.orderType,
      categoryUID: this.form.value.categoryUID ?? null,
      description: this.form.value.description ?? null,
      identificators: this.form.value.identificators ?? [],
      tags: this.form.value.tags ?? [],
      responsibleUID: this.form.value.responsibleUID ?? null,
      beneficiaryUID: this.form.value.beneficiaryUID ?? null,
      isForMultipleBeneficiaries: this.form.value.isForMultipleBeneficiaries,
      providerUID: this.form.value.providerUID ?? null,
      requestedByUID: this.form.value.requestedByUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      priority: this.form.value.priority ?? null,
      budgetUID: this.form.value.budgetUID ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: OrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: OrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case OrderHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: OrderHeaderEventType): string {
    switch (eventType) {
      case OrderHeaderEventType.DELETE: return `Eliminar ${this.config.orderNameSingular}`;
      default: return '';
    }
  }


  private getConfirmMessage(eventType: OrderHeaderEventType): string {
    switch (eventType) {
      case OrderHeaderEventType.DELETE:
        const orderTypeName = `${this.config.orderPronounSingular} ${this.config.orderNameSingular}`;
        const orderNo = !this.order.orderNo ? '' : `${this.order.orderNo}: `;
        const provider = isEmpty(this.order.provider) ? '' :
          `del proveedor <strong>${this.order.provider.name}</strong>`;

        return `Esta operación eliminará ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name}) ${provider}.
                <br><br>¿Elimino ${orderTypeName}?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: OrderHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.orderHeaderEvent, eventType, { orderUID: this.order.uid });
    }
  }

}
