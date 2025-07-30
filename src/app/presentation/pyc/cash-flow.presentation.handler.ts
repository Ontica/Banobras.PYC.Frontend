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
  OPERATION_SOURCES = 'PYC.CashFlow.Selector.OperationSources.List',
  PLANS             = 'PYC.CashFlow.Selector.Plans.List',
  PROJECT_TYPES     = 'PYC.CashFlow.Selector.ProjectTypes.List',
  PROJECTION_TYPES  = 'PYC.CashFlow.Selector.ProjectionTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.OPERATION_SOURCES, value: [] },
  { key: SelectorType.PLANS,             value: [] },
  { key: SelectorType.PROJECT_TYPES,     value: [] },
  { key: SelectorType.PROJECTION_TYPES,  value: [] },
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

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
