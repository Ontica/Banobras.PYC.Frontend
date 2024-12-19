/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { EntityStatus, ExplorerOperation, ExplorerOperationType } from './_explorer-data';


export interface ProductsQuery {
  productCategoryUID: string;
  productTypeUID: string;
  status: EntityStatus;
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


export interface ProductFields {
  productCategoryUID: string;
  managerUID: string;
  baseUnitUID: string;
  internalCode: string;
  name: string;
  identificators: string[];
  roles: string[];
  tags: string[];
  description: string;
}


export interface ProductBudgetSegmentFields {
  budgetSegmentUID: string;
  observations: string;
}


export interface ProductHolder {
  product: Product;
  budgetSegments: ProductBudgetSegment[];
  actions: ProductActions;
}


export interface Product {
  uid: string;
  name: string;
  description: string;
  internalCode: string;
  tags: string[];
  identificators: string[];
  baseUnit: Identifiable;
  manager: Identifiable;
  productCategory: Identifiable;
  productType: Identifiable;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export interface ProductBudgetSegment {
  uid: string;
  product: Identifiable;
  budgetType: Identifiable;
  budgetSegmentType: Identifiable;
  budgetSegment: Identifiable;
  observations: string;
}


export interface ProductActions {
  canUpdate: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canSuspend: boolean;
  canEditBudgetData: boolean;
}


export interface ProductSearch {
  uid: string;
  name: string;
  description: string;
  internalCode: string;
  baseUnit: Identifiable;
  managerName: string;
  productCategoryName: string;
  productTypeName: string;
}


export const ProductsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
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


export const EmptyProduct: Product = {
  uid: '',
  name: '',
  description: '',
  internalCode: '',
  tags: [],
  identificators: [],
  baseUnit: Empty,
  manager: Empty,
  productCategory: Empty,
  productType: Empty,
  startDate: '',
  endDate: '',
  status: Empty,
}


export const EmptyProductActions: ProductActions = {
  canUpdate: false,
  canDelete: false,
  canActivate: false,
  canSuspend: false,
  canEditBudgetData: false,
}


export const EmptyProductHolder: ProductHolder = {
  product: EmptyProduct,
  budgetSegments: [],
  actions: EmptyProductActions,
}


export const EmptyProductBudgetSegment: ProductBudgetSegment = {
  uid: '',
  product: Empty,
  budgetType: Empty,
  budgetSegmentType: Empty,
  budgetSegment: Empty,
  observations: '',
}


export function mapProductDescriptorFromProduct(product: Product): ProductDescriptor {
  return {
    uid: product.uid,
    name: product.name,
    description: product.description,
    internalCode: product.internalCode,
    baseUnitName: product.baseUnit.name,
    managerName: product.manager.name,
    productCategoryName: product.productCategory.name,
    productTypeName: product.productType.name,
    startDate: product.startDate,
    endDate: product.endDate,
    statusName: product.status.name,
  };
}
