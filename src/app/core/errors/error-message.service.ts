/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { LOGIN_PATH } from '@app/main-layout';

import { CLIENT_SIDE_ERROR_MESSAGE, OFFLINE_ERROR_MESSAGE, } from './error-messages';


@Injectable()
export class ErrorMessageService {

  constructor(private messageBox: MessageBoxService,
              private router: Router) { }


  handleOfflineError() {
    this.displayConsoleMessage('OFFLINE ERROR', OFFLINE_ERROR_MESSAGE);
    this.showErrorMessage(OFFLINE_ERROR_MESSAGE);
  }


  handleClientSideError(error) {
    this.displayConsoleMessage('CLIENT SIDE ERROR', error.message);
    this.showErrorMessage(CLIENT_SIDE_ERROR_MESSAGE);
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
    if (!this.messageBox.isOpen()) {
      const statusMessage = status ? `<strong>(${status})</strong>  ` : '';
      this.messageBox.showError(statusMessage + message)
        .firstValue();
    }
  }


  private handle401Error(message: string) {
    if (!this.messageBox.isOpen()) {
      const statusMessage = `<strong>(401)</strong> ${message}`;

      this.messageBox.showError(statusMessage)
        .firstValue()
        .then(x => this.router.navigateByUrl(LOGIN_PATH))
    }
  }

}
