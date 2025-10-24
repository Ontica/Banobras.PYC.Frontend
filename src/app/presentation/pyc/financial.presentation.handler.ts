/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialConceptsDataService, FinancialProjectsDataService,
         FinancialRulesDataService } from '@app/data-services';


export enum SelectorType {
  PROJECT_TYPES   = 'PYC.Financial.Selector.ProjectTypes.List',
  PROGRAMS        = 'PYC.Financial.Selector.Programs.List',
  SUBPROGRAMS     = 'PYC.Financial.Selector.Subprograms.List',
  CLASSIFICATIONS = 'PYC.Financial.Selector.ConceptsClassifications.List',
  GROUPS          = 'PYC.Financial.Selector.ConceptsGroups.List',
  RULES_TYPES     = 'PYC.Financial.Selector.RulesTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.PROJECT_TYPES,   value: [] },
  { key: SelectorType.PROGRAMS,        value: [] },
  { key: SelectorType.SUBPROGRAMS,     value: [] },
  { key: SelectorType.CLASSIFICATIONS, value: [] },
  { key: SelectorType.GROUPS,          value: [] },
  { key: SelectorType.RULES_TYPES,     value: [] },
];


@Injectable()
export class FinancialPresentationHandler extends AbstractPresentationHandler {

  constructor(private projectsData: FinancialProjectsDataService,
              private conceptsData: FinancialConceptsDataService,
              private rulesData: FinancialRulesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.PROJECT_TYPES: {
        const provider = () => this.projectsData.getProjectTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PROGRAMS: {
        const provider = () => this.projectsData.getPrograms();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SUBPROGRAMS: {
        const provider = () => this.projectsData.getSubprograms();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CLASSIFICATIONS: {
        const provider = () => this.conceptsData.getFinancialConceptsClassifications();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.GROUPS: {
        const provider = () => this.conceptsData.getFinancialConceptsGroups();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.RULES_TYPES: {
        const provider = () => this.rulesData.getRulesTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
