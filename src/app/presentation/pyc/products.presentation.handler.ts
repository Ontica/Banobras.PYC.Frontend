/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ProductsDataService } from '@app/data-services';


export enum SelectorType {
  PRODUCT_TYPES      = 'PYC.Products.Selector.ProductTypes.List',
  PRODUCT_CATEGORIES = 'PYC.Products.Selector.ProductCategories.List',
  PRODUCT_UNITS      = 'PYC.Products.Selector.ProductUnits.List',
}


const initialState: StateValues = [
  { key: SelectorType.PRODUCT_TYPES, value: [] },
  { key: SelectorType.PRODUCT_CATEGORIES, value: [] },
  { key: SelectorType.PRODUCT_UNITS, value: [] },
];


@Injectable()
export class ProductsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: ProductsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.PRODUCT_TYPES: {
        const provider = () => this.data.getProductTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PRODUCT_CATEGORIES: {
        const provider = () => this.data.getProductCategories();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PRODUCT_UNITS: {
        const provider = () => this.data.getProductUnits();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
