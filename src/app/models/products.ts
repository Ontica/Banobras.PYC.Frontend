/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';


export enum ProductsStatus {
  Pending      = 'Pending',
  Active       = 'Active',
  OnReview     = 'OnReview',
  Suspended    = 'Suspended',
  Discontinued = 'Discontinued',
  Deleted      = 'Deleted',
}


export const ProductStatusList: Identifiable<ProductsStatus>[] = [
  { uid: ProductsStatus.Pending,      name: 'Pendiente' },
  { uid: ProductsStatus.Active,       name: 'Activo' },
  { uid: ProductsStatus.OnReview,     name: 'En revisión' },
  { uid: ProductsStatus.Suspended,    name: 'Suspendido' },
  { uid: ProductsStatus.Discontinued, name: 'Descontinuado' },
  { uid: ProductsStatus.Deleted,      name: 'Eliminado' },
];


export interface ProductsQuery {
  productCategoryUID: string;
  productTypeUID: string;
  status: ProductsStatus;
  keywords: string;
  internalCode: string;
  tags: string[];
  managerUID: string;
}


export interface ProductDescriptor {
  uid: string;
  name: string;
  description: string;
  internalCode: string;
  baseUnitName: string;
  managerName: string;
  productCategoryName: string;
  productTypeName: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface Product {
  uid: string;
  name: string;
  description: string;
  internalCode: string;
  tags: string[];
  baseUnit: Identifiable;
  manager: Identifiable;
  productCategory: Identifiable;
  productType: Identifiable;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export enum ProductsOperationType {
  excel  = 'excel',
}


export const ProductsOperationsList: ExplorerOperation[] = [
  {
    uid: ProductsOperationType.excel,
    name: 'Exportar'
  },
];


export const EmptyProductsQuery: ProductsQuery = {
  productTypeUID: '',
  productCategoryUID: '',
  status: null,
  keywords: '',
  internalCode: '',
  tags: [],
  managerUID: '',
};
