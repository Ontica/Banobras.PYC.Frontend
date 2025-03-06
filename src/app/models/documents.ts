/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileReport } from './reporting';

import { FileType } from '@app/shared/form-controls';


export type DocumentsEntityTypes = 'bills' | 'contracts' | 'assets' |'payables' | 'payments-orders' |
  'requests' | 'orders' | 'budget-transactions' | 'fixed-asset-transactions';


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
}



export function getEntityModule(entityType: DocumentsEntityTypes): string {
  switch (entityType) {
    case 'bills': return 'v2/billing-management/bills';
    case 'contracts': return 'v8/procurement/contracts';
    case 'assets': return 'v2/assets';
    case 'payables': return 'v2/payments-management/payables';
    case 'payments-orders': return 'v2/payments-management/payment-orders';
    case 'requests': return 'v4/requests';
    case 'orders': return 'v8/order-management/orders';
    case 'budget-transactions': return 'v2/budgeting/transactions';
    case 'fixed-asset-transactions': return 'v2/fixed-assets/transactions';
    default: return '';
  }
}
