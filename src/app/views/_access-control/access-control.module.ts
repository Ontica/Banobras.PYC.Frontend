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
import { SecurityModule } from '../_security/security.module';

import { AccessControlControlsComponent } from './access-control-viewer/access-control-controls.component';
import { AccessControlFilterComponent } from './access-control-viewer/access-control-filter.component';
import { AccessControlTabbedViewComponent } from './access-control-tabbed-view/access-control-tabbed-view.component';
import { AccessControlViewerComponent } from './access-control-viewer/access-control-viewer.component';
import { ChangePasswordModalComponent } from './credentials/change-password-modal.component';
import { OperationsLogModalComponent } from './operations-log/operations-log-modal.component';
import { SecurityItemAssignComponent } from './security-item/security-item-assign.component';
import { SecurityItemEditionComponent } from './security-item/security-item-edition.component';
import { SubjectContextsComponent } from './subjects/subject-contexts.component';
import { SubjectCreatorComponent } from './subjects/subject-creator.component';
import { SubjectEditorComponent } from './subjects/subject-editor.component';
import { SubjectFeaturesComponent } from './subjects/subject-features.component';
import { SubjectHeaderComponent } from './subjects/subject-header.component';
import { SubjectRolesComponent } from './subjects/subject-roles.component';
import { SubjectsTableComponent } from './subjects/subjects-table.component';
import { SubjectTabbedViewComponent } from './subjects/subject-tabbed-view.component';
import { OperationsLogFilterComponent } from './operations-log/operations-log-filter.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    SecurityModule,
  ],
  declarations: [
    AccessControlControlsComponent,
    AccessControlFilterComponent,
    AccessControlTabbedViewComponent,
    AccessControlViewerComponent,
    ChangePasswordModalComponent,
    OperationsLogModalComponent,
    SecurityItemAssignComponent,
    SecurityItemEditionComponent,
    SubjectContextsComponent,
    SubjectCreatorComponent,
    SubjectEditorComponent,
    SubjectFeaturesComponent,
    SubjectHeaderComponent,
    SubjectRolesComponent,
    SubjectsTableComponent,
    SubjectTabbedViewComponent,
    OperationsLogFilterComponent,
  ],
  exports: [
    AccessControlTabbedViewComponent,
    AccessControlViewerComponent,
    ChangePasswordModalComponent,
    OperationsLogModalComponent,
  ]
})
export class AccessControlModule { }
