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


type DataTableColumnSize = 'xs' | 'sm' | 'md' | 'lg' |
                           'fluid-xs' | 'fluid-sm' | 'fluid-md' | 'fluid-lg' |
                           null;


export interface DataTableColumn {
  field: string;
  title: string;
  type: DataTableColumnType;
  digits?: number;
  linkField?: string;
  isColumnStrikethrough?: boolean;
  fieldConditionStrikethrough?: string;
  functionToShowButton?: (entry: DataTableEntry) => any;
  buttonText?: string;
  hasLevel?: boolean
  showShadow?: boolean;
  size?: DataTableColumnSize;
  showTooltip?: boolean;
  tooltipField?: string;
  truncate?: boolean;
}


export interface DataTableEntry {
  uid?: string;
  itemType?: DataTableItemType;
  level?: number;
  clickableEntry?: boolean;
}


export const EmptyDataTable: DataTable = {
  query: {},
  columns: [],
  entries: [],
};


export enum DataTableColumnType {
  text           = 'text',
  text_highlight = 'text-highlight',
  text_italic    = 'text-italic',
  text_link      = 'text-link',
  text_link_wrap = 'text-link-wrap',
  text_nowrap    = 'text-nowrap',
  decimal        = 'decimal',
  date           = 'date',
  text_tag       = 'text-tag',
  text_button    = 'text-button',
  check_box      = 'check-box',
  delete_button  = 'delete-button',
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


export const EntryStatusDisabledList: string[] = [
  'Eliminado', 'Suspendido', 'Descontinuado'
];


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


export function calculateDataColumnsSize(data: DataTable): DataTable {
  if (!data?.entries?.length) return data;

  data.columns.forEach(column => {
    if (!column.size && column.type === 'text') column.size = estimateTextSize(column.field, data.entries);
  });

  return data;
}


export function estimateTextSize(field: string,
                                 entries: DataTableEntry[],
                                 sampleSize = 50): DataTableColumnSize {
  if (!entries.length) return null;

  const sample = entries
    .slice(0, sampleSize)
    .map(row => String(row[field] ?? ''))
    .filter(value => value && !isCodeLikeText(value));

  if (!sample.length) return null;

  const avgLength = sample.reduce((sum, value) => sum + value.length, 0) / sample.length;

  if (avgLength > 40) return 'lg';
  if (avgLength > 22) return 'md';
  if (avgLength > 12) return 'sm';
  return null;
}


function isCodeLikeText(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (value.includes(' ')) return false;
  if (value.length < 12) return false;
  return /^[A-Za-z0-9\-_.]+$/.test(value);
}
