/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export enum FormFieldDataType {
  select    = 'listValue',
  input     = 'inputValue',
  text_area = 'textAreaValue',
  date      = 'dateValue',
}


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


export interface InputData {
  label: string;
  field: string;
  dataType: FormFieldDataType;
  values: Identifiable[];
};


export interface DataField {
  field: string;
  value: string;
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
