/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, AuthenticationService, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ChangePasswordFormEventType } from './change-password-form.component';

export enum ChangePasswordEventType {
  PASSWORD_CHANGED = 'ChangePasswordComponent.Event.PasswordChanged',
}

@Component({
  selector: 'emp-ng-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  @Input() isRequiredAction = false;

  @Output() changePasswordEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private authenticationService: AuthenticationService) { }


  onChangePasswordFormEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ChangePasswordFormEventType) {
      case ChangePasswordFormEventType.CHANGE_PASSWORD:
        Assertion.assertValue(event.payload.userID, 'event.payload.userID');
        Assertion.assertValue(event.payload.currentPassword, 'event.payload.currentPassword');
        Assertion.assertValue(event.payload.newPassword, 'event.payload.newPassword');

        this.changePassword(event.payload.userID,
                            event.payload.currentPassword,
                            event.payload.newPassword);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private changePassword(userID: string, currentPassword: string, newPassword: string) {
    this.submitted = true;

    this.authenticationService.changePassword(userID, currentPassword, newPassword)
      .then(x => this.resolveChangePassword())
      .finally(() => this.submitted = false);
  }


  private resolveChangePassword() {
    sendEvent(this.changePasswordEvent, ChangePasswordEventType.PASSWORD_CHANGED);
  }

}
