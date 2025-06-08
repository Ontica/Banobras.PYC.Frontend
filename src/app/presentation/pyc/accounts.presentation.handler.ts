/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ChartOfAccountsDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  CHARTS_OF_ACCOUNTS_LIST = 'PYC.Accounts.Selector.ChartsOfAccounts.List',
}


const initialState: StateValues = [
  { key: SelectorType.CHARTS_OF_ACCOUNTS_LIST, value: [] },
];


@Injectable()
export class AccountsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: ChartOfAccountsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CHARTS_OF_ACCOUNTS_LIST:
        const provider = () => this.data.getChartsOfAccounts();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
