/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileReport } from './reporting';

import { FileType } from '@app/shared/form-controls/file-control/file-control-data';


export type DocumentsEntityTypes = 'bills' | 'contracts' | 'payables' | 'payments-orders' | 'requests' |
  'transactions';


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
    case 'bills': return 'billing-management/bills';
    case 'contracts': return 'contracts';
    case 'payables': return 'payments-management/payables';
    case 'payments-orders': return 'payments-management/payment-orders';
    case 'requests': return 'budgeting/transactions';
    case 'transactions': return 'payments-management/payment-orders';
    default: return '';
  }
}
