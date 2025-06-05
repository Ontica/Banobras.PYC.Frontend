/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialProjectsDataService } from '@app/data-services';


export enum SelectorType {
  PROJECT_TYPES = 'PYC.FinancialProjects.Selector.ProjectTypes.List',
  PROGRAMS      = 'PYC.FinancialProjects.Selector.Programs.List',
  SUBPROGRAMS   = 'PYC.FinancialProjects.Selector.Subprograms.List',
}


const initialState: StateValues = [
  { key: SelectorType.PROJECT_TYPES, value: [] },
  { key: SelectorType.PROGRAMS,      value: [] },
  { key: SelectorType.SUBPROGRAMS,   value: [] },
];


@Injectable()
export class FinancialProjectsPresentationHandler extends AbstractPresentationHandler {

  constructor(private projectsData: FinancialProjectsDataService) {
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

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
