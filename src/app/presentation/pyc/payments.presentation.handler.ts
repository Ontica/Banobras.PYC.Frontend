/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { BillsDataService, PaymentOrdersDataService } from '@app/data-services';


export enum SelectorType {
  PAYMENT_ORDER_TYPES       = 'PYC.Payments.Selector.PaymentOrder.List',
  BILL_TYPES                = 'PYC.Payments.Selector.BillTypes.List',
  BILL_CATEGORIES           = 'PYC.Payments.Selector.BillCategories.List',
}


const initialState: StateValues = [
  { key: SelectorType.PAYMENT_ORDER_TYPES, value: [] },
  { key: SelectorType.BILL_TYPES, value: [] },
  { key: SelectorType.BILL_CATEGORIES, value: [] },
];


@Injectable()
export class PaymentsPresentationHandler extends AbstractPresentationHandler {

  constructor(private billsData: BillsDataService,
              private paymentOrdersData: PaymentOrdersDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.PAYMENT_ORDER_TYPES: {
        const provider = () => this.paymentOrdersData.getPaymentOrderTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.BILL_TYPES: {
        const provider = () => this.billsData.getBillTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.BILL_CATEGORIES: {
        const provider = () => this.billsData.getBillCategories();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
