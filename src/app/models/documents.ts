/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileReport } from './reporting';

import { FileType } from '@app/shared/form-controls/file-control/file-control-data';


export type DocumentsEntityTypes = 'bills' | 'contracts' | 'fixed-assets' |'payables' | 'payments-orders' |
  'requests' | 'transactions';


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
    case 'contracts': return 'v2/contracts';
    case 'fixed-assets': return 'v2/fixed-assets';
    case 'payables': return 'v2/payments-management/payables';
    case 'payments-orders': return 'v2/payments-management/payment-orders';
    case 'requests': return 'v4/requests';
    case 'transactions': return 'v2/budgeting/transactions';
    default: return '';
  }
}
