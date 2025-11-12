/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export enum ObjectTypes {
  ASSETS_CUSTODY   = 'ObjectTypeInfo.AssetTransaction.FixedAssetsCustody',
  ASSETS_INVENTORY = 'ObjectTypeInfo.AssetTransaction.FixedAssetsInventory',
  CONTRACT         = 'ObjectTypeInfo.Contract.Procurement',
  CREDIT_ACCOUNT   = 'ObjectTypeInfo.FinancialAccount.CreditAccount',
  CONTRACT_ORDER   = 'ObjectTypeInfo.Order.PayableOrder.ContractOrder',
  EXPENSE          = 'ObjectTypeInfo.Order.PayableOrder.Expenses',
  PURCHASE_ORDER   = 'ObjectTypeInfo.Order.PayableOrder.PurchaseOrder',
  REQUISITION      = 'ObjectTypeInfo.Order.Requisition',
}
