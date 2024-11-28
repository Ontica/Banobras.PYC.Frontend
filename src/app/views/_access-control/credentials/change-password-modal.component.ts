/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ChangePasswordEventType } from '@app/views/_security/change-password/change-password.component';

@Component({
  selector: 'emp-ng-change-password-modal',
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent  {

  @Output() closeEvent = new EventEmitter<void>();


  constructor(private messageBox: MessageBoxService) { }


  onClose() {
    this.closeEvent.emit();
  }


  onChangePasswordEvent(event: EventInfo) {
    switch (event.type as ChangePasswordEventType) {
      case ChangePasswordEventType.PASSWORD_CHANGED:
        this.messageBox.show('La contraseña fue actualizada correctamente.', 'Cambiar contraseña');
        this.onClose();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
