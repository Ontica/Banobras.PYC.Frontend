/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  CLASSIFICATIONS = 'PYC.FinancialConcepts.Selector.FinancialConceptsClassifications.List',
  GROUPS          = 'PYC.FinancialConcepts.Selector.FinancialConceptsGroups.List',
}


const initialState: StateValues = [
  { key: SelectorType.CLASSIFICATIONS, value: [] },
  { key: SelectorType.GROUPS, value: [] },
];


@Injectable()
export class FinancialConceptsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: FinancialConceptsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CLASSIFICATIONS: {
        const provider = () => this.data.getFinancialConceptsClassifications();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.GROUPS: {
        const provider = () => this.data.getFinancialConceptsGroups();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
