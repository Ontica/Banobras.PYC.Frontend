/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { ApplicationMessageService, EmpObservable  } from '@app/core';

import { MessageBoxService } from './message.box.service';

@Injectable()
export class ApplicationMessageAdapter extends ApplicationMessageService {


  constructor(private messageBox: MessageBoxService) {
    super();
  }


  isOpen(): boolean {
    return this.messageBox.isOpen();
  }


  showError(message: string): EmpObservable<void> {
    return this.messageBox.showError(message);
  }

}
