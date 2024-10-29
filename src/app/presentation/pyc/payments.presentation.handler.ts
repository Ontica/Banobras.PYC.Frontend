/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ContractsDataService, PayablesDataService, PaymentOrdersDataService } from '@app/data-services';


export enum SelectorType {
  CONTRACTS_TYPES       = 'PYC.Payments.Selector.Contracts.List',
  PAYABLES_TYPES        = 'PYC.Payments.Selector.Payables.List',
  PAYMENTS_ORDERS_TYPES = 'PYC.Payments.Selector.PaymentsOrdersTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.CONTRACTS_TYPES, value: [] },
  { key: SelectorType.PAYABLES_TYPES, value: [] },
  { key: SelectorType.PAYMENTS_ORDERS_TYPES, value: [] },
];


@Injectable()
export class PaymentsPresentationHandler extends AbstractPresentationHandler {

  constructor(private contractsData: ContractsDataService,
              private ordersData: PaymentOrdersDataService,
              private payablesData: PayablesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CONTRACTS_TYPES: {
        const provider = () => this.contractsData.getContractTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PAYABLES_TYPES: {
        const provider = () => this.payablesData.getPayableTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PAYMENTS_ORDERS_TYPES: {
        const provider = () => this.ordersData.getPaymentOrderTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
