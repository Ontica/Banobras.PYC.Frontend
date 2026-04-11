/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialAccountsDataService, FinancialConceptsDataService, FinancialProjectsDataService,
         FinancialRulesDataService } from '@app/data-services';


export enum SelectorType {
  CREDIT_PROJECT_TYPES     = 'PYC.Financial.Selector.CreditProjectTypes.List',
  CREDIT_STAGES            = 'PYC.Financial.Selector.CreditStages.List',
  CREDIT_TYPES             = 'PYC.Financial.Selector.CreditTypes.List',
  PROJECT_TYPES            = 'PYC.Financial.Selector.ProjectTypes.List',
  CONCEPTS_CLASSIFICATIONS = 'PYC.Financial.Selector.ConceptsClassifications.List',
  CONCEPTS_GROUPS          = 'PYC.Financial.Selector.ConceptsGroups.List',
  RULES_CATEGORIES         = 'PYC.Financial.Selector.RulesCategories.List',
}


const initialState: StateValues = [
  { key: SelectorType.CREDIT_PROJECT_TYPES,     value: [] },
  { key: SelectorType.CREDIT_STAGES,            value: [] },
  { key: SelectorType.CREDIT_TYPES,             value: [] },
  { key: SelectorType.PROJECT_TYPES,            value: [] },
  { key: SelectorType.CONCEPTS_CLASSIFICATIONS, value: [] },
  { key: SelectorType.CONCEPTS_GROUPS,          value: [] },
  { key: SelectorType.RULES_CATEGORIES,         value: [] },
];


@Injectable()
export class FinancialPresentationHandler extends AbstractPresentationHandler {

  constructor(private projectsData: FinancialProjectsDataService,
              private accountsData: FinancialAccountsDataService,
              private conceptsData: FinancialConceptsDataService,
              private rulesData: FinancialRulesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CREDIT_PROJECT_TYPES: {
        const provider = () => this.accountsData.getCreditProjectTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CREDIT_STAGES: {
        const provider = () => this.accountsData.getCreditStages();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CREDIT_TYPES: {
        const provider = () => this.accountsData.getCreditTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PROJECT_TYPES: {
        const provider = () => this.projectsData.getProjectTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CONCEPTS_CLASSIFICATIONS: {
        const provider = () => this.conceptsData.getFinancialConceptsClassifications();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CONCEPTS_GROUPS: {
        const provider = () => this.conceptsData.getFinancialConceptsGroups();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.RULES_CATEGORIES: {
        const provider = () => this.rulesData.getCategories();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
