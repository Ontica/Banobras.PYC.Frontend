/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthenticationService, EventInfo, LoginErrorAction, LoginErrorActionType } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum LoginEventType {
  CHANGE_PASSWORD_REQUIRED = 'LoginComponent.Event.ChangePasswordRequired',
}

@Component({
  selector: 'emp-ng-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Output() loginEvent = new EventEmitter<EventInfo>();

  showPassword = false;

  submitted = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;


  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }


  ngOnInit() {
    this.clearSession();
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  login() {
    if (this.form.invalid || this.submitted) {
      this.form.markAllAsTouched();
      return;
    }

    this.authenticate();
  }


  private authenticate() {
    this.submitted = true;

    this.authenticationService.login(this.form.value.userID, this.form.value.password)
      .then(
        x => this.router.navigate([x]),
        err => this.resolveLoginError(err)
      )
      .finally(() => this.submitted = false);
  }


  private resolveLoginError(error: LoginErrorAction) {
    switch (error.actionType) {
      case LoginErrorActionType.ChangePassword:
        this.emitChangePasswordRequired()
        this.exceptionMsg = error.message;
        return;

      case LoginErrorActionType.None:
        this.exceptionMsg = error.message;
        return;

      default:
        console.log(`Unhandled login error type ${error.actionType}`);
        return;
    }
  }


  private emitChangePasswordRequired() {
    sendEvent(this.loginEvent, LoginEventType.CHANGE_PASSWORD_REQUIRED);
  }


  private clearSession() {
    this.authenticationService.clearSession();
  }

}
