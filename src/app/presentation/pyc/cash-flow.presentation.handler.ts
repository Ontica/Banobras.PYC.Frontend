/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CashFlowDataService } from '@app/data-services';


export enum SelectorType {
  FINANCING_SOURCES = 'PYC.CashFlow.Selector.FinancingSources.List',
  OPERATION_TYPES   = 'PYC.CashFlow.Selector.OperationTypes.List',
  PROGRAMS          = 'PYC.CashFlow.Selector.Programs.List',
  SUBPROGRAMS       = 'PYC.CashFlow.Selector.Subprograms.List',
}


const initialState: StateValues = [
  { key: SelectorType.FINANCING_SOURCES, value: [] },
  { key: SelectorType.OPERATION_TYPES, value: [] },
  { key: SelectorType.PROGRAMS,      value: [] },
  { key: SelectorType.SUBPROGRAMS,   value: [] },
];


@Injectable()
export class CashFlowPresentationHandler extends AbstractPresentationHandler {

  constructor(private cashFlowData: CashFlowDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.FINANCING_SOURCES: {
        const provider = () => this.cashFlowData.getFinancingSources();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.OPERATION_TYPES: {
        const provider = () => this.cashFlowData.getOperationTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PROGRAMS: {
        const provider = () => this.cashFlowData.getPrograms();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SUBPROGRAMS: {
        const provider = () => this.cashFlowData.getSubprograms();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
