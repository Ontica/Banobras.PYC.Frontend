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

import { Assertion, DateString, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AssetsStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SearcherAPIS } from '@app/data-services';

import { AssetTransaction, AssetTransactionFields, buildLocationSelection, EmptyAssetTransaction,
         EmptyLocationSelection, LocationSelection, RequestsList, AssetTransactionActions,
         EmptyAssetTransactionActions } from '@app/models';


export enum TransactionHeaderEventType {
  CREATE    = 'AssetTransactionHeaderComponent.Event.CreateTransaction',
  UPDATE    = 'AssetTransactionHeaderComponent.Event.UpdateTransaction',
  CLOSE     = 'AssetTransactionHeaderComponent.Event.CloseTransaction',
  CLONE     = 'AssetTransactionHeaderComponent.Event.CloneTransaction',
  DELETE    = 'AssetTransactionHeaderComponent.Event.DeleteTransaction',
}

interface TransactionFormModel extends FormGroup<{
  transactionTypeUID: FormControl<string>;
  requestedTime: FormControl<DateString>;
  applicationTime: FormControl<DateString>;
  managerUID: FormControl<string>;
  managerOrgUnitUID: FormControl<string>;
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  location: FormControl<LocationSelection>;
  identificators: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pyc-transaction-header',
  templateUrl: './transaction-header.component.html',
})
export class AssetTransactionHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() transaction: AssetTransaction = EmptyAssetTransaction;

  @Input() actions: AssetTransactionActions = EmptyAssetTransactionActions;

  @Output() transactionHeaderEvent = new EventEmitter<EventInfo>();

  form: TransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  assigneesAPI = SearcherAPIS.assetsTransactionsAssignees;

  managersAPI = SearcherAPIS.assetsTransactionsManagers;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
    this.validateFieldsRequired();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate ||
           this.actions.canClose || this.actions.canClone;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? TransactionHeaderEventType.UPDATE : TransactionHeaderEventType.CREATE;
      sendEvent(this.transactionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.CLOSE);
  }


  onCloneButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.CLONE);
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
    this.validateFieldsRequired();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.assets }),
      this.helper.select<Identifiable[]>(AssetsStateSelector.ASSET_TRANSACTIONS_TYPES)
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.transactionTypesList = b;
      this.validateDataLists();
      this.isLoading = false;
    });
  }


  private validateDataLists() {
    if(this.isSaved) {
      this.transactionTypesList =
        ArrayLibrary.insertIfNotExist(this.transactionTypesList ?? [], this.transaction.transactionType, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      transactionTypeUID: ['', Validators.required],
      requestedTime: [null],
      applicationTime: [null],
      managerUID: ['', Validators.required],
      managerOrgUnitUID: ['', Validators.required],
      assignedToUID: ['', Validators.required],
      assignedToOrgUnitUID: ['', Validators.required],
      location: [EmptyLocationSelection, Validate.objectFieldsRequired('building', 'floor', 'place')],
      identificators: [null],
      tags: [null],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      const locationData = buildLocationSelection(
        this.transaction.building, this.transaction.floor, this.transaction.place
      );

      this.form.reset({
        transactionTypeUID: isEmpty(this.transaction.transactionType) ? null : this.transaction.transactionType.uid,
        requestedTime: this.transaction.requestedTime ?? null,
        applicationTime: this.transaction.applicationTime ?? null,
        managerUID: isEmpty(this.transaction.manager) ? null : this.transaction.manager.uid,
        managerOrgUnitUID: isEmpty(this.transaction.managerOrgUnit) ? null : this.transaction.managerOrgUnit.uid,
        assignedToUID: isEmpty(this.transaction.assignedTo) ? null : this.transaction.assignedTo.uid,
        assignedToOrgUnitUID: isEmpty(this.transaction.assignedToOrgUnit) ? null : this.transaction.assignedToOrgUnit.uid,
        location: locationData,
        identificators: this.transaction.identificators ?? null,
        tags: this.transaction.tags ?? null,
        description: this.transaction.description ?? null,
      });
    });
  }


  private getFormData(): AssetTransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: AssetTransactionFields = {
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      requestedTime: this.form.value.applicationTime ?? null,
      applicationTime: this.form.value.applicationTime ?? null,
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      managerUID: this.form.value.managerUID ?? null,
      managerOrgUnitUID: this.form.value.managerOrgUnitUID ?? null,
      locationUID: this.form.value.location.place.uid ?? null,
      identificators: this.form.value.identificators ?? [],
      tags: this.form.value.tags ?? [],
      description: this.form.value.description ?? null,
    };

    return data;
  }


  private validateFieldsRequired() {
    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.assignedToUID);
      FormHelper.markControlsAsUntouched(this.form.controls.managerUID);
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private showConfirmMessage(eventType: TransactionHeaderEventType) {
    const transactionUID = this.transaction.uid;
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.transactionHeaderEvent, eventType, { transactionUID }));
  }


  private getConfirmType(eventType: TransactionHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
        return 'DeleteCancel';
      case TransactionHeaderEventType.CLOSE:
      case TransactionHeaderEventType.CLONE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE: return 'Eliminar transacción';
      case TransactionHeaderEventType.CLOSE: return 'Cerrar transacción';
      case TransactionHeaderEventType.CLONE: return 'Clonar transacción';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: TransactionHeaderEventType): string {
    const description = `la transacción
      <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
      con responsable <strong>${this.transaction.assignedTo.name} (${this.transaction.assignedToOrgUnit.name})</strong>
      y localización en <strong>${this.transaction.locationName}</strong>`;

    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
        return `Esta operación eliminará ${description}.<br><br>¿Elimino la transacción?`;
      case TransactionHeaderEventType.CLOSE:
        return `Esta operación cerrará ${description}.<br><br>¿Cierro la transacción?`;
      case TransactionHeaderEventType.CLONE:
        return `Esta operación clonará ${description}.<br><br>¿Clono la transacción?`;
      default: return '';
    }
  }

}
