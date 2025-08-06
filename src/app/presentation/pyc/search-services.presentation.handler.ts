/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { SearchServicesDataService } from '@app/data-services';

import { EmptyRecordSearchData } from '@app/models';


export enum ActionType {
  SET_RECORD_SEARCH_DATA = 'PYC.SearchServicesPresentationHandler.Action.SetRecordSearchData',
}


export enum SelectorType {
  RECORD_SEARCH_DATA = 'PYC.SearchServicesPresentationHandler.Selector.RecordSearch.Data',
}


const initialState: StateValues = [
  { key: SelectorType.RECORD_SEARCH_DATA, value: EmptyRecordSearchData },
];


@Injectable()
export class SearchServicesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: SearchServicesDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    let provider: () => any;

    switch (selectorType) {

      default:
        return super.select<U>(selectorType, params);

    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_RECORD_SEARCH_DATA:
        Assertion.assertValue(params.recordSearchData, 'payload.recordSearchData');

        const recordSearchData = params.recordSearchData || this.getValue(SelectorType.RECORD_SEARCH_DATA);

        this.setValue(SelectorType.RECORD_SEARCH_DATA, recordSearchData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
