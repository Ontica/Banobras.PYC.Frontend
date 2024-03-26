/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Validate } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';


interface ChangePasswordFormModel extends FormGroup<{
  userID: FormControl<string>;
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}> { }

interface IPaswordRules {
  minlengthRequired: boolean;
  upperRequired: boolean;
  lowerRequired: boolean;
  numberRequired: boolean;
  specialCharactersRequired: boolean;
  minlength: number;
}

const DefaultPaswordRules: IPaswordRules = {
  minlengthRequired: true,
  upperRequired: true,
  lowerRequired: true,
  numberRequired: true,
  specialCharactersRequired: true,
  minlength: 8,
};


export enum ChangePasswordFormEventType {
  CHANGE_PASSWORD = 'ChangePasswordFormComponent.Event.ChangePassword',
}

@Component({
  selector: 'emp-ng-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent {

  @Input() isRequiredAction = false;

  @Input() submitted = false;

  @Output() changePasswordFormEvent = new EventEmitter<EventInfo>();

  form: ChangePasswordFormModel;

  formHelper = FormHelper;

  passwordRules: IPaswordRules = DefaultPaswordRules;

  showPassword = false;


  constructor() {
    this.initForm();
  }


  get newPasswordErrorsText(): string {
    const errors = this.getNewPasswordErrorsList();
    const isMatchError = this.form.errors?.matchOther && this.isRequiredAction;
    let errorText = '';

    if (errors.length > 0) {
      const errorsText =
        [errors.slice(0, -1).join(', '), errors.slice(-1)[0]].join(errors.length < 2 ? '' : ' y ');

      errorText += `La nueva contraseña debe contener ${errorsText}.`;
    }

    if (isMatchError) {
      errorText += errorText !== '' ? '<br><br>' : '';
      errorText += 'Las contraseñas no coinciden.';
    }

    return errorText;
  }


  onUpdateCredentialsClicked() {
    if (!this.formHelper.isFormReadyAndInvalidate(this.form)) {
      return;
    }

    const payload = {
      userID: this.form.value.userID ?? '',
      currentPassword: this.form.value.currentPassword ?? '',
      newPassword: this.form.value.newPassword ?? '',
    };

    sendEvent(this.changePasswordFormEvent, ChangePasswordFormEventType.CHANGE_PASSWORD, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group(
      {
        userID: ['', Validators.required],
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: [Validate.matchOther('newPassword', 'confirmNewPassword')],
      },
    );

    this.setNewPasswordValidators();
  }


  private setNewPasswordValidators() {
    let validators = [Validators.required];

    if (this.passwordRules.minlengthRequired) {
      validators.push(Validators.minLength(this.passwordRules.minlength ?? 5));
    }

    if (this.passwordRules.upperRequired) {
      validators.push(Validate.hasUpper);
    }

    if (this.passwordRules.lowerRequired) {
      validators.push(Validate.hasLower);
    }

    if (this.passwordRules.numberRequired) {
      validators.push(Validate.hasNumber);
    }

    if (this.passwordRules.specialCharactersRequired) {
      validators.push(Validate.hasSpecialCharacters);
    }

    this.formHelper.setControlValidators(this.form.controls.newPassword, validators);
  }


  private getNewPasswordErrorsList(): string[] {
    let rules: string[] = [];

    if (this.passwordRules.minlengthRequired &&
      (this.form.controls.newPassword.errors?.required || this.form.controls.newPassword.errors?.minlength)) {
      rules.push(`al menos ${this.passwordRules.minlength ?? 5} caracteres`);
    }

    if (this.passwordRules.upperRequired && this.form.controls.newPassword.errors?.hasUpper) {
      rules.push('mayúsculas');
    }

    if (this.passwordRules.lowerRequired && this.form.controls.newPassword.errors?.hasLower) {
      rules.push('minúsculas');
    }

    if (this.passwordRules.numberRequired && this.form.controls.newPassword.errors?.hasNumber) {
      rules.push('números');
    }

    if (this.passwordRules.specialCharactersRequired &&
      this.form.controls.newPassword.errors?.hasSpecialCharacters) {
      rules.push('caracteres especiales');
    }

    return rules;
  }

}
