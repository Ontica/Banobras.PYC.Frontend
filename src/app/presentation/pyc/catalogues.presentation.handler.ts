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
  COUNTRIES              = 'PYC.Catalogues.Selector.Countries.List',
  CURRENCIES             = 'PYC.Catalogues.Selector.Currencies.List',
  FINANCIAL_INSTITUTIONS = 'PYC.Catalogues.Selector.FinancialInstitutions.List',
  INTEREST_RATE_TYPES    = 'PYC.Catalogues.Selector.InterestRateTypes.List',
  ORGANIZATIONAL_UNITS   = 'PYC.Catalogues.Selector.OrganizationalUnits.List',
  PAYMENT_ACCOUNT_TYPES  = 'PYC.Catalogues.Selector.PaymentAccountTypes.List',
  PAYMENTS_METHODS       = 'PYC.Catalogues.Selector.PaymentsMethods.List',
  PERIODICITY_TYPES      = 'PYC.Catalogues.Selector.PeriodicityTypes.List',
  SUPPLIER_TYPES         = 'PYC.Catalogues.Selector.SupplierTypes.List',
  TAX_TYPES              = 'PYC.Catalogues.Selector.TaxTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.COUNTRIES, value: [] },
  { key: SelectorType.CURRENCIES, value: [] },
  { key: SelectorType.FINANCIAL_INSTITUTIONS, value: [] },
  { key: SelectorType.INTEREST_RATE_TYPES, value: [] },
  { key: SelectorType.ORGANIZATIONAL_UNITS, value: new Cache<Identifiable[]>() },
  { key: SelectorType.PAYMENT_ACCOUNT_TYPES, value: [] },
  { key: SelectorType.PAYMENTS_METHODS, value: [] },
  { key: SelectorType.PERIODICITY_TYPES, value: [] },
  { key: SelectorType.SUPPLIER_TYPES, value: [] },
  { key: SelectorType.TAX_TYPES, value: [] },
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

      case SelectorType.COUNTRIES: {
        const provider = () => this.data.getCountries();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.CURRENCIES: {
        const provider = () => this.data.getCurrencies();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.FINANCIAL_INSTITUTIONS: {
        const provider = () => this.data.getFinancialInstitutions();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.INTEREST_RATE_TYPES: {
        const provider = () => this.data.getInterestRateTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.ORGANIZATIONAL_UNITS:
        Assertion.assertValue(params.requestsList, 'params.requestsList');

        const requestsList = params.requestsList as RequestsList;

        const provider = () => this.data.getOrganizationalUnits(requestsList);

        return super.selectMemoized(selectorType, provider, requestsList, []);

      case SelectorType.PAYMENT_ACCOUNT_TYPES: {
        const provider = () => this.data.getPaymentAccountTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PAYMENTS_METHODS: {
        const provider = () => this.data.getPaymentMethods();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.PERIODICITY_TYPES: {
        const provider = () => this.data.getPeriodicityTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.TAX_TYPES: {
        const provider = () => this.data.getTaxTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      case SelectorType.SUPPLIER_TYPES: {
        const provider = () => this.data.getSupplierTypes();

        return super.selectFirst<U>(selectorType, provider);
      }

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
