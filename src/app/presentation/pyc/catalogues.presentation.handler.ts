/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable, Identifiable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CataloguesDataService } from '@app/data-services';

import { RequestsList } from '@app/models';


export enum SelectorType {
  CURRENCIES           = 'PYC.Catalogues.Selector.Currencies.List',
  ORGANIZATIONAL_UNITS = 'PYC.Catalogues.Selector.OrganizationalUnits.List',
  PAYMENTS_METHODS     = 'PYC.Catalogues.Selector.PaymentsMethods.List',
  PERIODICITY_TYPES    = 'PYC.Catalogues.Selector.PeriodicityTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.CURRENCIES, value: [] },
  { key: SelectorType.ORGANIZATIONAL_UNITS, value: new Cache<Identifiable[]>() },
  { key: SelectorType.PAYMENTS_METHODS, value: [] },
  { key: SelectorType.PERIODICITY_TYPES, value: [] },
];


@Injectable()
export class CataloguesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: CataloguesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.CURRENCIES: {
        const provider = () => this.data.getCurrencies();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ORGANIZATIONAL_UNITS:
        Assertion.assertValue(params.requestsList, 'params.requestsList');

        const requestsList = params.requestsList as RequestsList;

        const provider = () => this.data.getOrganizationalUnits(requestsList);

        return super.selectMemoized(selectorType, provider, requestsList, []);

      case SelectorType.PAYMENTS_METHODS: {
        const provider = () => this.data.getPaymentMethods();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PERIODICITY_TYPES: {
        const provider = () => this.data.getPeriodicityTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
