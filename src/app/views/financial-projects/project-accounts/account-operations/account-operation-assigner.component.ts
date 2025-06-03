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


export enum ProjectAccountOperationAssignerEventType {
  ASSIGN_BUTTON_CLICKED = 'FinancialProjectAccountOperationAssignerComponent.Event.AssignButtonClicked',
}

interface ProjectAccountOperationAssignerFormModel extends FormGroup<{
  operationUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-account-operation-assigner',
  templateUrl: './account-operation-assigner.component.html',
})
export class FinancialProjectAccountOperationAssignerComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() operations: Identifiable[] = [];

  @Output() projectAccountOperationAssignerEvent = new EventEmitter<EventInfo>();

  form: ProjectAccountOperationAssignerFormModel;

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
        projectUID: this.projectUID,
        accountUID: this.accountUID,
        operationUID: this.form.value.operationUID,
      };

      sendEvent(this.projectAccountOperationAssignerEvent,
        ProjectAccountOperationAssignerEventType.ASSIGN_BUTTON_CLICKED, payload);

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
