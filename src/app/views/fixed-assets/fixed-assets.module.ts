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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';
import { DocumentsModule } from '../documents/documents.module';

import { FixedAssetsMainPageComponent } from './fixed-assets-main-page/fixed-assets-main-page.component';
import { FixedAssetsExplorerComponent } from './fixed-assets-explorer/fixed-assets-explorer.component';
import { FixedAssetsFilterComponent } from './fixed-assets-explorer/fixed-assets-filter.component';
import { FixedAssetsTableComponent } from './fixed-assets-explorer/fixed-assets-table.component';
import { FixedAssetTabbedViewComponent } from './fixed-asset-tabbed-view/fixed-asset-tabbed-view.component';
import { FixedAssetEditorComponent } from './fixed-asset/fixed-asset-editor.component';
import { FixedAssetHeaderComponent } from './fixed-asset/fixed-asset-header.component';
import { FixedAssetTransactionsTableComponent } from './fixed-asset-transactions/fixed-asset-transactions-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    DocumentsModule,
    ReportsControlsModule,
  ],
  declarations: [
    FixedAssetsMainPageComponent,
    FixedAssetsExplorerComponent,
    FixedAssetsFilterComponent,
    FixedAssetsTableComponent,
    FixedAssetTabbedViewComponent,
    FixedAssetEditorComponent,
    FixedAssetHeaderComponent,
    FixedAssetTransactionsTableComponent,
  ],
  exports: [
    FixedAssetsMainPageComponent,
    FixedAssetsTableComponent,
  ],
})
export class FixedAssetsModule { }
