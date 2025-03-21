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

import { AssetsMainPageComponent } from './assets-main-page/assets-main-page.component';
import { AssetsExplorerComponent } from './assets-explorer/assets-explorer.component';
import { AssetsFilterComponent } from './assets-explorer/assets-filter.component';
import { AssetsTableComponent } from './assets-explorer/assets-table.component';
import { AssetTabbedViewComponent } from './asset-tabbed-view/asset-tabbed-view.component';
import { AssetEditorComponent } from './asset/asset-editor.component';
import { AssetHeaderComponent } from './asset/asset-header.component';
import { AssetTransactionsTableComponent } from './asset-transactions/asset-transactions-table.component';


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
    AssetsMainPageComponent,
    AssetsExplorerComponent,
    AssetsFilterComponent,
    AssetsTableComponent,
    AssetTabbedViewComponent,
    AssetEditorComponent,
    AssetHeaderComponent,
    AssetTransactionsTableComponent,
  ],
  exports: [
    AssetsMainPageComponent,
    AssetsTableComponent,
  ],
})
export class AssetsModule { }
