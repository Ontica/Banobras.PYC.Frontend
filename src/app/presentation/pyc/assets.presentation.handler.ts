/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AssetsDataService, AssetsTransactionsDataService } from '@app/data-services';


export enum SelectorType {
  ASSETS_TYPES              = 'PYC.Assets.Selector.AssetsTypes.List',
  ASSETS_TRANSACTIONS_TYPES = 'PYC.Assets.Selector.AssetsTransactionsTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.ASSETS_TYPES,              value: [] },
  { key: SelectorType.ASSETS_TRANSACTIONS_TYPES, value: [] },
];


@Injectable()
export class AssetsPresentationHandler extends AbstractPresentationHandler {

  constructor(private assetsData: AssetsDataService,
              private transactionsData: AssetsTransactionsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.ASSETS_TYPES: {
        const provider = () => this.assetsData.getAssetsTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ASSETS_TRANSACTIONS_TYPES: {
        const provider = () => this.transactionsData.getAssetsTransactionsTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
