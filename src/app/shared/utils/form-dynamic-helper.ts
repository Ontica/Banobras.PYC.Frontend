/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { FormControl, FormGroup, Validators } from "@angular/forms";

import { FormFieldData, RequestInputData, RequestTypeField } from "@app/models";


export class FormDynamicHelper {


  static existFormControl(form: FormGroup<any>, field: string): boolean {
    return !!form.controls[field];
  }


  static buildDynamicFields(form: FormGroup<any>,
                            inputData: RequestInputData[],
                            newFieldsRequired: boolean,
                            oldDynamicFields?: FormFieldData[]): FormFieldData[] {
    oldDynamicFields?.forEach(x => this.removeFormControl(form, x.field));

    const newDynamicFields =
      inputData.length > 0 ? inputData.map(x => this.getFormFieldData(x, newFieldsRequired)) : [];

    newDynamicFields.forEach(x => this.addFormControl(form, x.field, newFieldsRequired));

    return newDynamicFields;
  }


  static addFormControl(form: FormGroup<any>, control: string, required: boolean) {
    const validator = required ? Validators.required : [];

    if (!this.existFormControl(form, control)) {
      form.addControl(control as any, new FormControl('', validator));
    }
  }


  static removeFormControl(form: FormGroup<any>, control: string) {
    if (this.existFormControl(form, control)) {
      form.removeControl(control as any);
    }
  }


  static setFormControlValue(form: FormGroup<any>, control: string, value: string) {
    if (this.existFormControl(form, control)) {
      form.controls[control].reset(value);
    }
  }


  static getFormFieldData(inputData: RequestInputData, requerid: boolean): FormFieldData {
    const data: FormFieldData = {
      label: inputData.label,
      field: inputData.field,
      fieldType: inputData.dataType,
      values: inputData.values,
      required: requerid,
      multiple: false,
    };

    return data;
  }


  static buildRequestTypeField(form: FormGroup<any>, field: FormFieldData): RequestTypeField {
    const data: RequestTypeField = {
      field: field.field,
      value: form.value[field.field] ?? '',
    };

    return data;
  }

}
