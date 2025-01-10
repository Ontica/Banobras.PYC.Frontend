/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Progress } from '@app/shared/utils';

import { Observable } from 'rxjs';


export const CsvFileTypeException = 'application/vnd.ms-excel'; // csv, xls


export enum FileTypeAccepted {
  all = '*',
  pdf = 'application/pdf',
  excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv = '.csv, text/csv',
  image = 'image/*',
  txt = 'text/plain',
  xml = 'application/xml, text/xml',
}


export type FileType = 'all' | 'pdf' | 'excel' | 'csv' | 'txt' | 'image' | 'xml';


export interface FileControlConfig {
  autoUpload?: boolean;
  fileName?: string;
  filesTypes?: FileType[];
  maxFiles?: number;
  placeholder?: string;
  placeholderReadonly?: string;
  showFileInfo?: boolean;
  tagDefault?: any;
  tagsList?: any[];
  tagRequired?: boolean;
  textAccion?: string;
  textSave?: string;
  textTemplate?: string;
}


export const DefaultFileControlConfig: FileControlConfig = {
  autoUpload: false,
  fileName: null,
  filesTypes: ['all'],
  maxFiles: 1,
  placeholder: 'Elegir un archivo o arrástrarlo y soltarlo aquí.',
  placeholderReadonly: 'No se han agregado archivos.',
  showFileInfo: true,
  tagDefault: null,
  tagsList: [],
  tagRequired: false,
  textAccion: 'Agregar archivo',
  textSave: 'Guardar archivo',
  textTemplate: 'Descargar plantilla',
};


export type FileControlActions = 'SAVE' | 'CANCEL' | 'SHOW' | 'DOWNLOAD' | 'REMOVE';


export class FileControlMenuOptions {
  name: string;
  action: FileControlActions;
  disabled?: boolean;
  icon?: string;
}


export class FileData {
  uid?: string;
  name?: string;
  url?: string;
  size?: number;
  type?: string;
  menuOptions?: FileControlMenuOptions[];
  sizeString?: string;
  fileIcon?: string;
  file?: File;
  tag?: string;
  download$?: Observable<Progress>;
  hasError?: boolean;
}


export const EmptyFileData: FileData = {
  uid: '',
  name: '',
  url: '',
  size: 0,
  type: '',
  menuOptions: [],
  sizeString: '',
  fileIcon: '',
  tag: '',
  file: null,
};


export interface FileViewerData {
  fileList: FileData[];
  selectedFile?: FileData;
  title?: string;
  hint?: string;
}


export const EmptyFileViewerData: FileViewerData = {
  fileList: [],
  title: 'Visor de Archivos',
  hint: '',
};


export interface FileControlEventData {
  option: string;
  file: any;
}
