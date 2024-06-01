/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";

export interface FormFieldData {
  label: string;
  field: string;
  fieldType: FormFieldDataType;
  required: boolean;
  multiple: boolean;
  dataType?: string;
  values?: Identifiable[];
  value?: string;
}


export enum FormFieldDataType {
  select        = 'listValue',
  input         = 'inputValue',
  text_area     = 'textAreaValue',
  date          = 'dateValue',
}


export const DefaultFormFieldData: FormFieldData = {
  label: 'Field',
  field: 'Field',
  fieldType: FormFieldDataType.input,
  required: false,
  multiple: false,
  dataType: 'None',
  values: [],
  value: '',
}
