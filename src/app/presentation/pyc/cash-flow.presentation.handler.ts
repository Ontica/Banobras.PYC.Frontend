/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CashFlowProjectionsDataService, CashLedgerDataService } from '@app/data-services';


export enum SelectorType {
  ACCOUNTING_LEDGERS  = 'PYC.CashFlow.Selector.AccountingLedgers.List',
  OPERATION_SOURCES   = 'PYC.CashFlow.Selector.OperationSources.List',
  PLANS               = 'PYC.CashFlow.Selector.Plans.List',
  PROJECT_TYPES       = 'PYC.CashFlow.Selector.ProjectTypes.List',
  PROJECTION_TYPES    = 'PYC.CashFlow.Selector.ProjectionTypes.List',
  TRANSACTION_SOURCES = 'PYC.CashFlow.Selector.TransactionSources.List',
  TRANSACTION_TYPES   = 'PYC.CashFlow.Selector.TransactionTypes.List',
  VOUCHER_TYPES       = 'PYC.CashFlow.Selector.VoucherTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.ACCOUNTING_LEDGERS,  value: [] },
  { key: SelectorType.OPERATION_SOURCES,   value: [] },
  { key: SelectorType.PLANS,               value: [] },
  { key: SelectorType.PROJECT_TYPES,       value: [] },
  { key: SelectorType.PROJECTION_TYPES,    value: [] },
  { key: SelectorType.TRANSACTION_SOURCES, value: [] },
  { key: SelectorType.TRANSACTION_TYPES,   value: [] },
  { key: SelectorType.VOUCHER_TYPES,       value: [] },
];


@Injectable()
export class CashFlowPresentationHandler extends AbstractPresentationHandler {

  constructor(private projectionsData: CashFlowProjectionsDataService,
              private cashLedgerData: CashLedgerDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.ACCOUNTING_LEDGERS: {
        const provider = () => this.cashLedgerData.getAccountingLedgers();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.OPERATION_SOURCES: {
        const provider = () => this.projectionsData.getOperationSources();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PLANS: {
        const provider = () => this.projectionsData.getPlans();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PROJECT_TYPES: {
        const provider = () => this.projectionsData.getProjectTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PROJECTION_TYPES: {
        const provider = () => this.projectionsData.getProjectionTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.TRANSACTION_SOURCES: {
        const provider = () => this.cashLedgerData.getTransactionSources();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.TRANSACTION_TYPES: {
        const provider = () => this.cashLedgerData.getTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.VOUCHER_TYPES: {
        const provider = () => this.cashLedgerData.getVoucherTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
