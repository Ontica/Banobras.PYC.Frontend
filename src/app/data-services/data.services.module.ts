/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';

import { SubjectAccountabilitiesDataService } from './_subject-accountabilities.data.service';

import { SearcherDataService } from './_searcher.data.service';

import { AccountabilitiesDataService } from './accountabilities.data.service';

import { AssetsAssignmentsDataService } from './assets-assignments.data.service';

import { AssetsDataService } from './assets.data.service';

import { AssetsTransactionsDataService } from './assets-transactions.data.service';

import { BillsDataService } from './bills.data.service';

import { BudgetsDataService } from './budgets.data.service';

import { BudgetTransactionsDataService } from './budget-transactions.data.service';

import { CashFlowDataService } from './cash-flow.data.service';

import { CashFlowProjectionsDataService } from './cash-flow-projections.data.service';

import { CashLedgerDataService } from './cash-ledger.data.service';

import { CataloguesDataService } from './catalogues.data.service';

import { ChartOfAccountsDataService } from './chart-of-accounts.service';

import { DocumentsDataService } from './documents.data.service';

import { FinancialAccountsDataService } from './financial-accounts.data.service';

import { FinancialConceptsDataService } from './financial-concepts.data.service';

import { FinancialProjectsDataService } from './financial-projects.data.service';

import { FinancialRulesDataService } from './financial-rules.data.service';

import { OrdersDataService } from './orders.data.service';

import { PartiesDataService } from './parties.data.service';

import { PaymentOrdersDataService } from './payment-orders.data.service';

import { PaymentInstructionsDataService } from './payment-instructions.data.service';

import { PayrollsIntegrationDataService } from './payrolls-integration.data.service';

import { ProductsDataService } from './products.data.service';

import { RequestsDataService } from './requests.data.service';

import { SearchServicesDataService } from './search-services.data.service';

import { StepsDataService } from './steps.data.service';

import { SuppliersDataService } from './suppliers.data.service';

import { TaxesDataService } from './taxes.data.service';


@NgModule({

  providers: [
    AccessControlDataService,
    SubjectAccountabilitiesDataService,
    SearcherDataService,
    AccountabilitiesDataService,
    AssetsAssignmentsDataService,
    AssetsDataService,
    AssetsTransactionsDataService,
    BillsDataService,
    BudgetsDataService,
    BudgetTransactionsDataService,
    CashFlowDataService,
    CashFlowProjectionsDataService,
    CashLedgerDataService,
    CataloguesDataService,
    ChartOfAccountsDataService,
    DocumentsDataService,
    FinancialAccountsDataService,
    FinancialConceptsDataService,
    FinancialProjectsDataService,
    FinancialRulesDataService,
    OrdersDataService,
    PartiesDataService,
    PaymentOrdersDataService,
    PaymentInstructionsDataService,
    PayrollsIntegrationDataService,
    ProductsDataService,
    RequestsDataService,
    SearchServicesDataService,
    StepsDataService,
    SuppliersDataService,
    TaxesDataService,
  ]

})
export class DataServicesModule { }
