/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface DataTable {
  query: DataTableQuery;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export interface DataTableQuery {

}


export interface DataTableColumn {
  field: string;
  title: string;
  type: DataTableColumnType;
  digits?: number;
  isColumnStrikethrough?: boolean;
  fieldConditionStrikethrough?: string;
  functionToShowButton?: (entry: DataTableEntry) => any;
  buttonText?: string;
}


export interface DataTableEntry {
  uid?: string;
  itemType?: DataTableItemType;
  clickableEntry?: boolean;
}


export const EmptyDataTable: DataTable = {
  query: {},
  columns: [],
  entries: [],
};


export enum DataTableColumnType {
  text          = 'text',
  text_link     = 'text-link',
  text_nowrap   = 'text-nowrap',
  decimal       = 'decimal',
  date          = 'date',
  text_tag      = 'text-tag',
  text_button   = 'text-button',
  check_box     = 'check-box',
  delete_button = 'delete-button',
}


export type DataTableItemType = 'Entry' | 'Summary' | 'Group' | 'Total';


export const EntryItemTypeList: DataTableItemType[] = [
  'Entry',
];


export const SummaryItemTypeList: DataTableItemType[] = [
  'Summary',
];


export const GroupItemTypeList: DataTableItemType[] = [
  'Group',
];


export const TotalItemTypeList: DataTableItemType[] = [
  'Total',
];


export const ClickeableItemTypeList: DataTableItemType[] = [...EntryItemTypeList];


export const CheckBoxDataTableColumn: DataTableColumn = {
  field: 'selection',
  title: '',
  type: DataTableColumnType.check_box,
};


export const DeleteButtonDataTableColumn: DataTableColumn = {
  field: 'actionDelete',
  title: '',
  type: DataTableColumnType.delete_button,
};
