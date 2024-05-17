/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable, Identifiable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { BudgetsDataService } from '@app/data-services';


export enum SelectorType {
  BUDGET_TYPES          = 'BP.BudgetPlanning.Selector.BudgetTypes.List',
  SEGMENT_ITEMS_BY_TYPE = 'BP.BudgetPlanning.Selector.SegmentItemsByType.List',
}


const initialState: StateValues = [
  { key: SelectorType.BUDGET_TYPES         , value: [] },
  { key: SelectorType.SEGMENT_ITEMS_BY_TYPE, value: new Cache<Identifiable[]>() },
];


@Injectable()
export class BudgetPlanningPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: BudgetsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.BUDGET_TYPES: {
        const provider = () => this.data.getBudgetTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SEGMENT_ITEMS_BY_TYPE: {
        Assertion.assertValue(params.segmentType, 'params.segmentType');

        const segmentType = params.segmentType as string;

        const dataProvider = () => this.data.getSegmentItemsByType(segmentType);

        return super.selectMemoized(selectorType, dataProvider, segmentType, []);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
