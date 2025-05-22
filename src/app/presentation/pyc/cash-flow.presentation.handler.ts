/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CashFlowProjectionsDataService } from '@app/data-services';


export enum SelectorType {
  PLANS             = 'PYC.CashFlow.Selector.Plans.List',
  CATEGORIES        = 'PYC.CashFlow.Selector.Categories.List',
  CLASSIFICATIONS   = 'PYC.CashFlow.Selector.Classifications.List',
  OPERATION_SOURCES = 'PYC.CashFlow.Selector.OperationSources.List',
}


const initialState: StateValues = [
  { key: SelectorType.PLANS,             value: [] },
  { key: SelectorType.CATEGORIES,        value: [] },
  { key: SelectorType.CLASSIFICATIONS,   value: [] },
  { key: SelectorType.OPERATION_SOURCES, value: [] },
];


@Injectable()
export class CashFlowPresentationHandler extends AbstractPresentationHandler {

  constructor(private projectionsData: CashFlowProjectionsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.PLANS: {
        const provider = () => this.projectionsData.getPlans();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CATEGORIES: {
        const provider = () => this.projectionsData.getCategories();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CLASSIFICATIONS: {
        const provider = () => this.projectionsData.getClassifications();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.OPERATION_SOURCES: {
        const provider = () => this.projectionsData.getOperationSources();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
