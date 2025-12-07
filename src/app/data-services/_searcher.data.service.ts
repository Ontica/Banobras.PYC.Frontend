/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { DataTableQuery } from '@app/models';


export enum SearcherAPIS {
  accountabilityResponsibles  = 'v8/human-resources/accountabilities/responsibles/search-available',
  accountabilityCommissioners = 'v5/security/management/subjects/commissioners/search-available',
  assetsAssignees             = 'v2/assets/assignees',
  assetsTransactionsAssignees = 'v2/assets/transactions/assignees/',
  assetsTransactionsManagers  = 'v2/assets/transactions/managers/',
  assetsTransactionsParties   = 'v2/assets/transactions/parties/',
  budgetTransactionsParties   = 'v2/budgeting/transactions/parties/',
  budgetTransactionAccounts   = 'v2/budgeting/transactions/accounts/search',
  relatedDocumentsForEdition  = 'v2/budgeting/related-documents/for-transaction-edition/search',
  cashFlowAccounts            = 'v1/cash-flow/accounts/',
  cashFlowProjects            = 'v1/cash-flow/projects/',
  cashFlowProjectionsParties  = 'v1/cash-flow/projections/parties/',
  payableEntities             = 'v2/payments-management/payable-entities/search',
  productBudgetSegments       = 'v8/product-management/budget-segments/available',
  productManagers             = 'v8/product-management/primary-party/product-managers/',
  products                    = 'v8/product-management/products/search',
  productUnits                = 'v8/product-management/product-units/',
  projects                    = 'v8/projects/',
  provider                    = 'v8/parties/primary-party/suppliers-list/',
}

@Injectable()
export class SearcherDataService {


  constructor(private http: HttpService) { }


  searchData(searcherAPI: SearcherAPIS, keywords: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(searcherAPI, 'searcherAPI');
    Assertion.assertValue(keywords, 'keywords');

    const path = searcherAPI + `?keywords=${keywords}`;

    return this.http.get<Identifiable[]>(path);
  }


  searchDataByQuery(searcherAPI: SearcherAPIS, query: DataTableQuery): EmpObservable<Identifiable[]> {
    Assertion.assertValue(searcherAPI, 'searcherAPI');
    Assertion.assertValue(query, 'query');

    const path = searcherAPI;

    return this.http.post<Identifiable[]>(path, query);
  }

}
