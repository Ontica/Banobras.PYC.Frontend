/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export enum ObjectTypes {
  ASSETS_CUSTODY    = 'ObjectTypeInfo.AssetTransaction.FixedAssetsCustody',
  ASSETS_INVENTORY  = 'ObjectTypeInfo.AssetTransaction.FixedAssetsInventory',
  CREDIT_ACCOUNT    = 'ObjectTypeInfo.FinancialAccount.CreditAccount',
  PROSPECTED_CREDIT = 'ObjectTypeInfo.FinancialAccount.ProspectedCredit',
  TREASURY_ACCOUNT  = 'ObjectTypeInfo.FinancialAccount.TreasuryAccount',
  REQUISITION       = 'ObjectTypeInfo.Order.Requisition',
  CONTRACT          = 'ObjectTypeInfo.Order.Contract',
  CONTRACT_ORDER    = 'ObjectTypeInfo.Order.PayableOrder.ContractOrder',
  PURCHASE          = 'ObjectTypeInfo.Order.PayableOrder.PurchaseOrder',
  EXPENSE           = 'ObjectTypeInfo.Order.PayableOrder.Expenses',
  PAYMENT_ORDER     = 'ObjectTypeInfo.PaymentOrder',
}
