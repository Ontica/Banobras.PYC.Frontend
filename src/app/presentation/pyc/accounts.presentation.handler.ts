/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ChartOfAccountsDataService, FinancialAccountsDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  CHARTS_OF_ACCOUNTS_LIST = 'PYC.Accounts.Selector.ChartsOfAccounts.List',
  STANDARD_ACCOUNTS_LIST  = 'PYC.Accounts.Selector.StandardAccounts.List',
  ACCOUNTS_TYPES_LIST     = 'PYC.Accounts.Selector.AccountsTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.CHARTS_OF_ACCOUNTS_LIST, value: [] },
  { key: SelectorType.STANDARD_ACCOUNTS_LIST, value: [] },
  { key: SelectorType.ACCOUNTS_TYPES_LIST, value: [] },
];


@Injectable()
export class AccountsPresentationHandler extends AbstractPresentationHandler {

  constructor(private chartOfAccountsData: ChartOfAccountsDataService,
              private accountsData: FinancialAccountsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CHARTS_OF_ACCOUNTS_LIST: {
        const provider = () => this.chartOfAccountsData.getChartsOfAccounts();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.STANDARD_ACCOUNTS_LIST: {
        const provider = () => this.chartOfAccountsData.getStandardAccounts();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ACCOUNTS_TYPES_LIST: {
        const provider = () => this.accountsData.getAccountsTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
