/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Contract, ContractItem } from './contracts';

import { PayableOrder, PayableOrderDescriptor, PayableOrderFields, PayableOrderItem,
         PayableOrderItemFields } from './payable-orders';


export interface ContractOrderDescriptor extends PayableOrderDescriptor {
  contractNo: string;
  contractName: string;
}

export interface ContractOrderFields extends PayableOrderFields {
  contractUID: string;
}


export interface ContractOrder extends PayableOrder {
  contract: Contract;
}


export interface ContractOrderItem extends PayableOrderItem {
  contractItem: ContractItem;
}


export interface ContractOrderItemFields extends PayableOrderItemFields {
  contractItemUID: string;
}


export function mapContractOrderDescriptorFromContractOrder(order: ContractOrder): ContractOrderDescriptor {
  return {
    uid: order.uid,
    contractNo: order.contract.contractNo,
    contractName: order.contract.name,
    typeName: order.type.name,
    categoryName: order.category.name,
    orderNo: order.orderNo,
    description: order.description,
    responsibleName: order.responsible.name,
    beneficiaryName: order.beneficiary.name,
    providerName: order.provider.name,
    requestedByName: order.requestedBy.name,
    projectName: order.project.name,
    priorityUID: order.priority.uid,
    priorityName: order.priority.name,
    authorizationTime: order.authorizationTime,
    authorizedByName: order.authorizedBy.name,
    closingTime: order.closingTime,
    closedByName: order.closedBy.name,
    statusName: order.status.name,
    budgetTypeName: order.budgetType?.name ?? '',
    budgetName: order.budget?.name ?? '',
    currencyName: order.currency?.name ?? '',
    total: order.total ?? null,
  };
}
