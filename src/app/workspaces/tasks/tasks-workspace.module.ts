/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksWorkspaceRoutingModule } from './tasks-workspace-routing.module';


@NgModule({

  imports: [
    CommonModule,

    TasksWorkspaceRoutingModule,
  ],

})
export class TasksWorkspaceModule { }
