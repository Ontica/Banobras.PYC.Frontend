
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

import { RequestsMainPageComponent } from './requests-main-page/requests-main-page.component';
import { RequestsExplorerComponent } from './requests-explorer/requests-explorer.component';
import { RequestTabbedViewComponent } from './request-tabbed-view/request-tabbed-view.component';

import { RequestsFilterComponent } from './requests-explorer/requests-filter.component';
import { RequestsListComponent } from './requests-explorer/requests-list.component';
import { RequestsListHeaderComponent } from './requests-explorer/requests-list-header.component';
import { RequestsListItemComponent } from './requests-explorer/requests-list-item.component';
import { RequestsListControlsComponent } from './requests-explorer/requests-list-controls.component';

import { RequestHeaderComponent } from './request/request-header.component';
import { RequestCreatorComponent } from './request/request-creator.component';
import { RequestEditorComponent } from './request/request-editor.component';
import { RequestStepsEditionComponent } from './request-steps/request-steps-edition.component';
import { RequestStepsListComponent } from './request-steps/request-steps-list.component';
import { RequestStepsListItemComponent } from './request-steps/request-steps-list-item.component';
import { RequestStepsListControlsComponent } from './request-steps/request-steps-list-controls.component';
import { RequestStepEditorComponent } from './request-steps/request-step-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    RequestsMainPageComponent,
    RequestsExplorerComponent,
    RequestTabbedViewComponent,

    RequestsFilterComponent,
    RequestsListComponent,
    RequestsListHeaderComponent,
    RequestsListItemComponent,
    RequestsListControlsComponent,

    RequestHeaderComponent,
    RequestCreatorComponent,
    RequestEditorComponent,
    RequestStepsEditionComponent,
    RequestStepsListComponent,
    RequestStepsListItemComponent,
    RequestStepsListControlsComponent,
    RequestStepEditorComponent,
  ],
  exports: [
    RequestsMainPageComponent,
  ]
})
export class RequestsModule { }
