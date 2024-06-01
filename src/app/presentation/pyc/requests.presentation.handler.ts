/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable, Identifiable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { RequestsDataService } from '@app/data-services';

import { ProcessGroup } from '@app/models';


export enum SelectorType {
  ORGANIZATIONAL_UNITS = 'PYC.Requests.Selector.OrganizationalUnits.List',
  REQUEST_STATUS       = 'PYC.Requests.Selector.RequestStatus.List',
}


const initialState: StateValues = [
  { key: SelectorType.ORGANIZATIONAL_UNITS, value: new Cache<Identifiable[]>() },
  { key: SelectorType.REQUEST_STATUS,       value: [] },
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

      case SelectorType.ORGANIZATIONAL_UNITS:
        Assertion.assertValue(params.processGroup, 'params.processGroup');

        const processGroup = params.processGroup as ProcessGroup;

        const provider = () => this.data.getOrganizationalUnits(processGroup);

        return super.selectMemoized(selectorType, provider, processGroup, []);

      case SelectorType.REQUEST_STATUS: {
        const provider = () => this.data.getRequestStatus();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
