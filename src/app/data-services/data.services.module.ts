/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';

import { BudgetsDataService } from './budgets.data.service';

import { CataloguesDataService } from './catalogues.data.service';

import { RequestsDataService } from './requests.data.service';


@NgModule({

  providers: [
    AccessControlDataService,

    BudgetsDataService,
    CataloguesDataService,
    RequestsDataService,
  ]

})
export class DataServicesModule { }
