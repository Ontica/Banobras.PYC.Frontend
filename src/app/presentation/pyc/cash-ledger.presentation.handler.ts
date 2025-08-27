/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CashLedgerDataService } from '@app/data-services';


export enum SelectorType {
  ACCOUNTING_LEDGERS  = 'PYC.CashLedger.Selector.AccountingLedgers.List',
  TRANSACTION_SOURCES = 'PYC.CashLedger.Selector.TransactionSources.List',
  TRANSACTION_TYPES   = 'PYC.CashLedger.Selector.TransactionTypes.List',
  VOUCHER_TYPES       = 'PYC.CashLedger.Selector.VoucherTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.ACCOUNTING_LEDGERS,  value: [] },
  { key: SelectorType.TRANSACTION_SOURCES, value: [] },
  { key: SelectorType.TRANSACTION_TYPES,   value: [] },
  { key: SelectorType.VOUCHER_TYPES,       value: [] },
];


@Injectable()
export class CashLedgerPresentationHandler extends AbstractPresentationHandler {

  constructor(private cashLedgerData: CashLedgerDataService) {
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
