/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Command, EmpObservable } from '@app/core';

import { ActionType, StateSelector, CommandType } from './presentation-types';

import { PresentationState } from './presentation.state';

import { SubscriptionHelper } from './subscription.helper';


@Injectable()
export class PresentationLayer {


  constructor(private presenter: PresentationState) { }


  createCommand(type: CommandType, payload?: any): Command {
    return this.presenter.createCommand(type, payload);
  }

  createSubscriptionHelper(): SubscriptionHelper {
    return new SubscriptionHelper(this);
  }

  execute(command: Command | CommandType): void;

  execute<T>(commandType: Command | CommandType): Promise<T>;

  execute<T>(command: Command | CommandType): Promise<T> | void {
    Assertion.assertValue(command, 'command');

    return this.presenter.execute<T>(command);
  }

  dispatch(actionType: ActionType, payload?: any): void {
    Assertion.assertValue(actionType, 'actionType');

    return this.presenter.dispatch(actionType, payload);
  }


  select<T>(selector: StateSelector, params?: any): EmpObservable<T> {
    Assertion.assertValue(selector, 'selector');

    return this.presenter.select<T>(selector, params);
  }

  selectValue<T>(selector: StateSelector): T {
    Assertion.assertValue(selector, 'selector');

    return this.presenter.getValue<T>(selector);
  }

}
