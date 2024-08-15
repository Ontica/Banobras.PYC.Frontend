/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonModule } from '@angular/common';

import { DataServicesModule } from '@app/data-services/data.services.module';

import { PresentationModule } from './presentation/presentation.module';

import { SessionService } from './general/session.service';
import { LocalStorageService } from './general/local-storage.service';
import { LoggerService } from './general/logger.service';
import { ApplicationSettingsService } from './general/application-settings.service';
import { ApplicationStatusService } from './general/application-status.service';
import { NavigationService } from './general/navigation.service';

import { DirectoryService } from './http/directory.service';
import { HttpHandler } from './http/http-handler';
import { HttpService } from './http/http.service';
import { HttpErrorInterceptor } from './http/http-error-interceptor';

import { SecurityDataService } from './security/security-data.service';
import { AuthenticationService } from './security/authentication.service';
import { RoutingStateService } from './security/routing-state.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

// Define global exception handler provider
import { ExceptionHandler } from './general/exception-handler';

import { ErrorMessageService } from './errors/error-message.service';


@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,
    DataServicesModule,
    PresentationModule
  ],

  declarations: [],

  exports: [],

  providers: [
    ErrorMessageService,
    SessionService,
    ApplicationSettingsService,
    ApplicationStatusService,
    LocalStorageService,
    LoggerService,
    NavigationService,
    SecurityDataService,
    AuthenticationService,
    HttpHandler,
    HttpService,
    DirectoryService,
    RoutingStateService,

    { provide: ErrorHandler, useClass: ExceptionHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }

  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}
