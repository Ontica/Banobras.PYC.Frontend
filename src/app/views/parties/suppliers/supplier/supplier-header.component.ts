/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, FlexibleIdentifiable, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { SkipIf } from '@app/shared/decorators';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { Supplier, SupplierFields, EmptySupplier } from '@app/models';


export enum SupplierHeaderEventType {
  CREATE = 'SupplierHeaderComponent.Event.Create',
  UPDATE = 'SupplierHeaderComponent.Event.Update',
  DELETE = 'SupplierHeaderComponent.Event.Delete',
}

interface SupplierFormModel extends FormGroup<{
  typeUID: FormControl<string>;
  name: FormControl<string>;
  taxCode: FormControl<string>;
  subledgerAccount: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-supplier-header',
  templateUrl: './supplier-header.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
  ],
})
export class SupplierHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() canUpdate = false;

  @Input() canDelete = false;

  @Input() supplier: Supplier = EmptySupplier;

  @Output() supplierHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: SupplierFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoadingDataLists = false;

  isLoading = false;

  typesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.supplier && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.canUpdate || this.canDelete;
  }


  // get displayMatchSubledgerAccount() {
  //   return (!this.isSaved || (this.isSaved && this.canUpdate)) && !this.form.getRawValue().subledgerAccount;
  // }


  // get isReadytoMatchSubledgerAccount() {
  //   return !this.form.getRawValue().subledgerAccount &&
  //     (this.form.controls.name.valid && this.form.controls.taxCode.valid)
  // }


  // onSubledgerAccountReset() {
  //   this.form.controls.subledgerAccount.reset();
  // }


  // @SkipIf('isLoading')
  // onSubledgerAccountSearch() {
  //   if (this.isReadytoMatchSubledgerAccount) {
  //     const command: MatchSubledgerAccountFields = {
  //       uid: this.isSaved ? this.supplier.uid : null,
  //       name: this.form.value.name ?? null,
  //       taxCode: this.form.value.taxCode ?? null,
  //     };

  //     this.getMatchSubledgerAccount(command);
  //   }

  //   this.formHelper.markFormControlsAsTouched(this.form);
  // }


  @SkipIf('isLoading')
  onSubmitButtonClicked() {
    if (this.form.valid) {
      const eventType = this.isSaved ? SupplierHeaderEventType.UPDATE : SupplierHeaderEventType.CREATE;
      sendEvent(this.supplierHeaderEvent, eventType, { dataFields: this.getFormData() });
    }

    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(SupplierHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoadingDataLists = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.SUPPLIER_TYPES)
      .subscribe(x => {
        this.typesList = x;
        this.isLoadingDataLists = x.length === 0;
        this.validateDataLists();
      });
  }


  // private getMatchSubledgerAccount(command: MatchSubledgerAccountFields) {
  //   this.isLoading = true;

  //   this.suppliersData.getMatchSubledgerAccount(command)
  //     .firstValue()
  //     .then(x => this.resolveMatchSubledgerAccountResponse(x))
  //     .finally(() => this.isLoading = false);
  // }


  private resolveMatchSubledgerAccountResponse(response: FlexibleIdentifiable) {
    const subledgerAccount = `${response.number}: ${response.name}`
    this.form.controls.subledgerAccount.reset(subledgerAccount);
  }


  private validateDataLists() {
    this.typesList = ArrayLibrary.insertIfNotExist(this.typesList ?? [], this.supplier.type, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      typeUID: ['', Validators.required],
      name: ['', Validators.required],
      taxCode: ['', Validators.required],
      subledgerAccount: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        typeUID: FormHelper.getUIDValue(this.supplier.type),
        name: FormHelper.getStringValue(this.supplier.name),
        taxCode: FormHelper.getStringValue(this.supplier.taxCode),
        subledgerAccount: FormHelper.getStringValue(this.supplier.subledgerAccount),
      });
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
      // FormHelper.setDisableControl(this.form.controls.subledgerAccount);
    });
  }


  private getFormData(): SupplierFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formData = this.form.getRawValue();

    const data: SupplierFields = {
      typeUID: formData.typeUID ?? null,
      name: formData.name ?? null,
      taxCode: formData.taxCode ?? null,
      subledgerAccount: formData.subledgerAccount ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: SupplierHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.supplierHeaderEvent, eventType, { dataUID: this.supplier.uid }));
  }


  private getConfirmType(eventType: SupplierHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case SupplierHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: SupplierHeaderEventType): string {
    switch (eventType) {
      case SupplierHeaderEventType.DELETE: return 'Eliminar proveedor';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: SupplierHeaderEventType): string {
    switch (eventType) {
      case SupplierHeaderEventType.DELETE:
        return `Esta operación eliminará el proveedor
                <strong>${this.supplier.name} (${this.supplier.type.name})</strong>
                <br><br>¿Elimino el proveedor?`;

      default: return '';
    }
  }

}
