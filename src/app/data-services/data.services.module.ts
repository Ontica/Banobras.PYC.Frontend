/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';

import { SearcherDataService } from './_searcher.data.service';

import { BillsDataService } from './bills.data.service';

import { BudgetsDataService } from './budgets.data.service';

import { BudgetTransactionsDataService } from './budget-transactions.data.service';

import { CataloguesDataService } from './catalogues.data.service';

import { ContractsDataService } from './contracts.data.service';

import { DocumentsDataService } from './documents.data.service';

import { FixedAssetsDataService } from './fixed-assets.data.service';

import { FixedAssetTransactionsDataService } from './fixed-asset-transactions.data.service';

import { OrdersDataService } from './orders.data.service';

import { PayablesDataService } from './payables.data.service';

import { PaymentOrdersDataService } from './payment-orders.data.service';

import { ProductsDataService } from './products.data.service';

import { RequestsDataService } from './requests.data.service';

import { StepsDataService } from './steps.data.service';


@NgModule({

  providers: [
    AccessControlDataService,
    SearcherDataService,
    BillsDataService,
    BudgetsDataService,
    BudgetTransactionsDataService,
    CataloguesDataService,
    ContractsDataService,
    DocumentsDataService,
    FixedAssetsDataService,
    FixedAssetTransactionsDataService,
    OrdersDataService,
    PayablesDataService,
    PaymentOrdersDataService,
    ProductsDataService,
    RequestsDataService,
    StepsDataService,
  ]

})
export class DataServicesModule { }
