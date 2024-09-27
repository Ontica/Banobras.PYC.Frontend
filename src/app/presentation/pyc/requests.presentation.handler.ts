/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { RequestsDataService } from '@app/data-services';


export enum SelectorType {
  REQUESTS_STATUS = 'PYC.Requests.Selector.RequestsStatus.List',
}


const initialState: StateValues = [
  { key: SelectorType.REQUESTS_STATUS, value: [] },
];


@Injectable()
export class RequestsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: RequestsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.REQUESTS_STATUS: {
        const provider = () => this.data.getRequestsStatus();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
