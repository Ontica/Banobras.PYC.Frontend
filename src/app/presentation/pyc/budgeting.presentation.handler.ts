/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable, Identifiable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { BudgetsDataService, BudgetTransactionsDataService } from '@app/data-services';


export enum SelectorType {
  BUDGET_TYPES          = 'PYC.Budgeting.Selector.BudgetTypes.List',
  SEGMENT_ITEMS_BY_TYPE = 'PYC.Budgeting.Selector.SegmentItemsByType.List',
  OPERATION_SOURCES     = 'PYC.Budgeting.Selector.OperationSources.List',
}


const initialState: StateValues = [
  { key: SelectorType.BUDGET_TYPES         , value: [] },
  { key: SelectorType.SEGMENT_ITEMS_BY_TYPE, value: new Cache<Identifiable[]>() },
  { key: SelectorType.OPERATION_SOURCES, value: [] },
];


@Injectable()
export class BudgetingPresentationHandler extends AbstractPresentationHandler {

  constructor(private budgetsData: BudgetsDataService,
              private transactionsData: BudgetTransactionsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.BUDGET_TYPES: {
        const provider = () => this.budgetsData.getBudgetTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SEGMENT_ITEMS_BY_TYPE: {
        Assertion.assertValue(params.segmentType, 'params.segmentType');

        const segmentType = params.segmentType as string;

        const dataProvider = () => this.budgetsData.getSegmentItemsByType(segmentType);

        return super.selectMemoized(selectorType, dataProvider, segmentType, []);
      }

      case SelectorType.OPERATION_SOURCES: {
        const provider = () => this.transactionsData.getOperationSources();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
