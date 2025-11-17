/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './base/data-table';


export const DefaultEndDate: DateString = '2049-12-31';


export enum ReportGroup {
  Reportes = 'Reportes',
}


export enum ReportController {
  Reporting = 'Reporting',
}


export interface ReportType<T> extends Identifiable {
  uid: string;
  name: string;
  group: ReportGroup;
  controller: ReportController;
  show?: T;
  accountsCharts?: string[];
  outputType?: Identifiable[];
  exportTo?: ExportationType[];
}


export interface FileReport {
  url: string;
  type?: FileType;
}


export enum FileType {
  Excel = 'Excel',
  Csv = 'Csv',
  PDF = 'PDF',
  Xml = 'Xml',
  HTML = 'HTML',
}


export interface ExportationType extends Identifiable {
  uid: string;
  name: string;
  fileType: FileType;
  dataset?: string;
  startDate?: DateString;
  endDate?: DateString;
}


export interface ReportTypeFlags {

}


export interface ReportQuery extends DataTableQuery {
  reportType?: string;
  fromDate?: DateString;
  toDate?: DateString;
  exportTo?: string;
}


export interface ReportData extends DataTable {
  query: ReportQuery;
  columns: DataTableColumn[];
  entries: ReportEntry[];
}


export interface ReportEntry extends DataTableEntry {
  uid: string;
}


export interface DateRange {
  fromDate: DateString;
  toDate: DateString;
}


export const EmptyDateRange: DateRange = {
  fromDate: '',
  toDate: '',
};


export const DefaultExportationType: ExportationType = {
  uid: FileType.Excel,
  name: FileType.Excel,
  fileType: FileType.Excel,
};


export const EmptyReportTypeFlags: ReportTypeFlags = {

};


export const EmptyReportType: ReportType<ReportTypeFlags> = {
  uid: '',
  name: '',
  group: null,
  controller: null,
};


export const EmptyReportQuery: ReportQuery = {
  reportType: '',
};


export const EmptyReportData: ReportData = {
  query: EmptyReportQuery,
  columns: [],
  entries: [],
};
