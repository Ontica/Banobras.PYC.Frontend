/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Contract, ContractItem } from './contracts';

import { PayableOrder, PayableOrderDescriptor, PayableOrderFields, PayableOrderItem, PayableOrderItemFields,
         mapPayableOrderDescriptorFromPayableOrder } from './payable-orders';


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
    ...mapPayableOrderDescriptorFromPayableOrder(order),
    ...
    {
      contractNo: order.contract.contractNo,
      contractName: order.contract.name,
    }
  };
}
