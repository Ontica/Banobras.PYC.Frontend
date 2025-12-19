/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { AccountabilitiesModule } from '@app/views/_accountabilities/accountabilities.module';
import { BillingModule } from '../billing/billing.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { PartiesMainPageComponent } from './parties-main-page/parties-main-page.component';
import { PartiesExplorerComponent } from './parties-explorer/parties-explorer.component';
import { PartiesFilterComponent } from './parties-explorer/parties-filter.component';
import { PartyTabbedViewComponent } from './party-tabbed-view/party-tabbed-view.component';
import { PartyViewComponent } from './party/party-view.component';

import { SupplierCreatorComponent } from "./suppliers/supplier/supplier-creator.component";
import { SupplierEditorComponent } from './suppliers/supplier/supplier-editor.component';
import { PaymentAccountsEditionComponent } from './suppliers/payment-accounts/payment-accounts-edition.component';
import { PaymentAccountsTableComponent } from './suppliers/payment-accounts/payment-accounts-table.component';
import { PaymentAccountEditorComponent } from './suppliers/payment-accounts/payment-account-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AccountabilitiesModule,
    BillingModule,
    EntityRecordsModule,
    ReportsControlsModule,

    SupplierCreatorComponent,
    SupplierEditorComponent,
],
  declarations: [
    PartiesMainPageComponent,
    PartiesExplorerComponent,
    PartiesFilterComponent,
    PartyTabbedViewComponent,
    PartyViewComponent,

    PaymentAccountsEditionComponent,
    PaymentAccountsTableComponent,
    PaymentAccountEditorComponent,
  ],
  exports: [
    PartiesMainPageComponent,
  ],
})
export class PartiesModule { }
