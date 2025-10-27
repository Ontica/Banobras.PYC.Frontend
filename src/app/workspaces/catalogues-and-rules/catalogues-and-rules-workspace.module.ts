/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CataloguesAndRulesWorkspaceRoutingModule } from './catalogues-and-rules-workspace-routing.module';

import { ChartOfAccountsModule } from '@app/views/chart-of-accounts/chart-of-accounts.module';
import { FinancialConceptsModule } from '@app/views/financial-concepts/financial-concepts.module';
import { FinancialRulesModule } from '@app/views/financial-rules/financial-rules.module';


@NgModule({

  imports: [
    CommonModule,

    CataloguesAndRulesWorkspaceRoutingModule,

    ChartOfAccountsModule,
    FinancialConceptsModule,
    FinancialRulesModule,
  ]

})
export class CataloguesAndRulesWorkspaceModule { }
