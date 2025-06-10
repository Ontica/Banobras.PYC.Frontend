/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';


export enum OperationAssignerEventType {
  ASSIGN_BUTTON_CLICKED = 'OperationAssignerComponent.Event.AssignButtonClicked',
}

interface OperationAssignerFormModel extends FormGroup<{
  operationUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-operation-assigner',
  templateUrl: './operation-assigner.component.html',
})
export class OperationAssignerComponent implements OnChanges {

  @Input() accountUID = '';

  @Input() operations: Identifiable[] = [];

  @Output() operationAssignerEvent = new EventEmitter<EventInfo>();

  form: OperationAssignerFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.resetFormData();
  }


  onAssignClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        accountUID: this.accountUID,
        operationUID: this.form.value.operationUID,
      };

      sendEvent(this.operationAssignerEvent,
        OperationAssignerEventType.ASSIGN_BUTTON_CLICKED, payload);

    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      operationUID: ['', Validators.required],
    });
  }


  private resetFormData() {
    this.form.reset();
  }

}
