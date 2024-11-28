/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { of, tap } from 'rxjs';

import { Assertion, EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { MessageBoxService } from '@app/shared/services';


export enum ActionType {
  SET_IS_USER_WORKING   = 'Empiria.UI-Flag.AppStatus.SetIsUserWorking',
}


export enum SelectorType {
  IS_USER_WORKING     = 'Empiria.UI-Flag.AppStatus.IsUserWorking',
  CAN_CLOSE_USER_WORK = 'Empiria.UI-Flag.AppStatus.CanCloseUserWork',
}


export interface AppStatusState {
  readonly isUserWorking: boolean;
}


const initialState: StateValues = [
  { key: SelectorType.IS_USER_WORKING, value: false },
];


@Injectable()
export class AppStatusPresentationHandler extends AbstractPresentationHandler {

  constructor(private messageBox: MessageBoxService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }


  get state(): AppStatusState {
    return {
      isUserWorking: this.getValue(SelectorType.IS_USER_WORKING),
    };
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.IS_USER_WORKING:
        return super.select<U>(selectorType);

      case SelectorType.CAN_CLOSE_USER_WORK:
        return this.canCloseUserWork();

      default:
        return super.select<U>(selectorType, params);

    }
  }


  dispatch(actionType: ActionType, payload?: any): void {

    switch (actionType) {

      case ActionType.SET_IS_USER_WORKING:
        Assertion.assert(typeof payload === 'boolean', `${actionType} payload must be a boolean value.`);
        this.setValue(SelectorType.IS_USER_WORKING, payload);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }


  private canCloseUserWork(): EmpObservable<any> {
    if (this.state.isUserWorking) {

      const message = `Esta operación descartará los cambios y perderá la información modificada.
                      <br><br>¿Descarto los cambios?`;

      return new EmpObservable(

          this.messageBox.confirm(message, 'Descartar cambios')
            .pipe(tap(x => x ? this.setValue(SelectorType.IS_USER_WORKING, false) : null))

        );

    } else {

      return new EmpObservable<boolean>(of(true));

    }
  }

}
