/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileReport } from './reporting';

import { FileType } from '@app/shared/form-controls';


export type DocumentsEntityTypes = 'asset-assignments' | 'asset-transactions' | 'assets' | 'bills' |
  'budget-transactions' | 'cash-flow' | 'cash-transactions' | 'contracts' | 'financial-accounts' |
  'financial-projects' | 'orders' | 'payables' | 'payments-orders' | 'requests' | 'suppliers';


export interface Document {
  uid: string;
  name: string;
  documentNo: string;
  documentCategory: Identifiable;
  documentProduct: Identifiable;
  documentDate: DateString;
  description: string;
  postingTime: DateString;
  lastUpdateTime: DateString;
  tags: string[];
  file: FileReport;
  status: Identifiable;
}


export interface DocumentFields {
  documentProductUID: string;
  name: string;
  total?: number;
}


export interface DocumentCategory extends Identifiable {
  uid: string;
  name: string;
  products: DocumentProduct[];
}


export interface DocumentProduct {
  uid: string;
  name: string;
  fileType: FileType;
  appplicationContentType: string;
  isCFDI: boolean;
}


export function getEntityModule(entityType: DocumentsEntityTypes): string {
  switch (entityType) {
    case 'asset-assignments': return 'v2/assets/assignments';
    case 'asset-transactions': return 'v2/assets/transactions';
    case 'assets': return 'v2/assets';
    case 'bills': return 'v2/billing-management/bills';
    case 'budget-transactions': return 'v2/budgeting/transactions';
    case 'cash-flow': return 'v1/cash-flow/projections';
    case 'cash-transactions': return 'v1/cash-flow/cash-ledger/transactions';
    case 'financial-accounts': return 'v2/financial-accounts';
    case 'financial-projects': return 'v1/financial-projects';
    case 'orders': return 'v8/order-management/orders';
    case 'payables': return 'v2/payments-management/payables';
    case 'payments-orders': return 'v2/payments-management/payment-orders';
    case 'requests': return 'v4/requests';
    case 'suppliers': return 'v8/procurement/suppliers';
    default: return '';
  }
}
