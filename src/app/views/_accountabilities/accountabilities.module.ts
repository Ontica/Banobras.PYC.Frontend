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

import { AccountabilitiesControlsComponent } from './accountabilities-edition/accountabilities-controls.component';
import { AccountabilitiesTableComponent } from './accountabilities-edition/accountabilities-table.component';
import { AccountabilityEditorComponent } from './accountabilities-edition/accountability-editor.component';
import { CommisionerAccountabilitiesEditionComponent } from './commissioner-accountabilities/commissioner-accountabilities-edition.component';
import { SubjectAccountabilitiesEditionComponent } from './subject-accountabilities/subject-accountabilities-edition.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    AccountabilitiesControlsComponent,
    AccountabilitiesTableComponent,
    AccountabilityEditorComponent,
    CommisionerAccountabilitiesEditionComponent,
    SubjectAccountabilitiesEditionComponent,
  ],
  exports: [
    CommisionerAccountabilitiesEditionComponent,
    SubjectAccountabilitiesEditionComponent,
  ],
})
export class AccountabilitiesModule { }
