/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { LOGIN_PATH } from '@app/data';

import { CLIENT_SIDE_ERROR_MESSAGE, OFFLINE_ERROR_MESSAGE, } from './error-messages';

import { ApplicationAlertsService } from '../general/application-alerts.service';

import { ApplicationMessageService } from '../general/application-message.service';


@Injectable()
export class ErrorMessageService {

  constructor(private router: Router,
              private appMessage: ApplicationMessageService,
              private appAlerts: ApplicationAlertsService) { }


  handleOfflineError() {
    this.displayConsoleMessage('OFFLINE ERROR', OFFLINE_ERROR_MESSAGE);
    this.showErrorMessage(OFFLINE_ERROR_MESSAGE);
  }


  handleClientSideError(error) {
    if (this.isChunkLoadError(error)) {
      this.appAlerts.handleOutdatedApp();
    } else {
      this.showErrorMessage(CLIENT_SIDE_ERROR_MESSAGE);
    }

    this.displayConsoleMessage('CLIENT SIDE ERROR', error?.message ?? 'Unknown client-side error');
  }


  handleServerSideError(error, request?) {
    this.displayConsoleMessage('SERVER SIDE ERROR', `Status: ${error.status}.`, error.message);

    switch (error.status) {
      case 401:
        this.handle401Error(error.error.message);
        return;

      default:
        this.showErrorMessage(error.error.message, error.status);
        return;
    }
  }


  private displayConsoleMessage(errorType: string, message1: string, message2?: any) {
    console.log(` \n%c${errorType.toUpperCase()}: `, 'color:red', message1,
      (message2 ? ` \n\n${message2}\n` : ''));
  }


  private showErrorMessage(message: string, status?: string) {
    if (!this.appMessage.isOpen()) {
      const statusMessage = status ? `<strong>(${status})</strong>  ` : '';
      this.appMessage.showError(statusMessage + message)
        .firstValue();
    }
  }


  private handle401Error(message: string) {
    if (!this.appMessage.isOpen()) {
      const statusMessage = `<strong>(401)</strong> ${message}`;

      this.appMessage.showError(statusMessage)
        .firstValue()
        .then(x => this.router.navigateByUrl(LOGIN_PATH))
    }
  }


  private isChunkLoadError(error): boolean {
    const message = error?.message ?? '';
    return message.includes('Loading chunk') || message.includes('ChunkLoadError');
  }

}
