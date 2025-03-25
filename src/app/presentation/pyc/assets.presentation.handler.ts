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
  ASSET_TYPES              = 'PYC.Assets.Selector.AssetTypes.List',
  ASSET_TRANSACTIONS_TYPES = 'PYC.Assets.Selector.AssetTransactionsTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.ASSET_TYPES,              value: [] },
  { key: SelectorType.ASSET_TRANSACTIONS_TYPES, value: [] },
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

      case SelectorType.ASSET_TYPES: {
        const provider = () => this.assetsData.getAssetTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ASSET_TRANSACTIONS_TYPES: {
        const provider = () => this.transactionsData.getAssetTransactionsTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
