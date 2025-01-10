/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable, Identifiable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AccessControlDataService } from '@app/data-services';


export enum SelectorType {
  WORKAREAS_LIST      = 'SM.AccessControl.Selector.Workareas.List',
  CONTEXTS_LIST       = 'SM.AccessControl.Selector.Contexts.List',
  ROLES_BY_CONTEXT    = 'SM.AccessControl.Selector.RolesByContext.List',
  FEATURES_BY_CONTEXT = 'SM.AccessControl.Selector.FeaturesByContext.List',
}


const initialState: StateValues = [
  { key: SelectorType.WORKAREAS_LIST, value: [] },
  { key: SelectorType.CONTEXTS_LIST, value: [] },
  { key: SelectorType.ROLES_BY_CONTEXT, value: new Cache<Identifiable[]>() },
  { key: SelectorType.FEATURES_BY_CONTEXT, value: new Cache<Identifiable[]>() },
];


@Injectable()
export class AccessControlPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: AccessControlDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.WORKAREAS_LIST: {
        const provider = () => this.data.getWorkareas();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CONTEXTS_LIST: {
        const provider = () => this.data.getContexts();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ROLES_BY_CONTEXT: {
        Assertion.assertValue(params, 'params');

        const contextUID = params as string;

        const dataProvider = () => this.data.getRolesByContext(contextUID);

        return super.selectMemoized(selectorType, dataProvider, contextUID, []);
      }
      case SelectorType.FEATURES_BY_CONTEXT: {
        Assertion.assertValue(params, 'params');

        const contextUID = params as string;

        const dataProvider = () => this.data.getFeaturesByContext(contextUID);

        return super.selectMemoized(selectorType, dataProvider, contextUID, []);
      }
      default:
        return super.select<U>(selectorType, params);

    }
  }

}
