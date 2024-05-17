/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainLayoutPresentationHandler } from './main-layout/main-layout.presentation.handler';

import { AppStatusPresentationHandler } from './app-data/app-status.presentation.handler';

import { AccessControlPresentationHandler } from './security-management/access-control.presentation.handler';

import { BudgetingPresentationHandler } from './pyc/budgeting.presentation.handler';


@NgModule({

  providers: [
    MainLayoutPresentationHandler,
    AppStatusPresentationHandler,
    AccessControlPresentationHandler,
    BudgetingPresentationHandler,

    { provide: STATE_HANDLERS, useExisting: MainLayoutPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AppStatusPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccessControlPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: BudgetingPresentationHandler, multi: true },

  ]

})
export class StateHandlersModule { }
