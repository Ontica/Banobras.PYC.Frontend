/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Inject, Injectable, InjectionToken } from '@angular/core';

import { Assertion, Command, CommandResult, EmpObservable,
         createCommand as createCommandAlias } from '@app/core';

import { PresentationHandler } from './presentation.handler';

import { CommandType, ActionType, StateEffect, StateSelector } from './presentation-types';

import { MainUIStateAction } from '@app/presentation/exported.presentation.types';


export const STATE_HANDLERS = new InjectionToken<PresentationHandler[]>('PresentationStateHandlers');


@Injectable()
export class PresentationState {

  private processing = false;

  constructor(@Inject(STATE_HANDLERS) private registeredHandlers: PresentationHandler[]) { }


  get isProcessing() {
    return this.processing;
  }


  applyEffects(effectType: StateEffect, payload?: any): void {
    Assertion.assertValue(effectType, 'effectType');

    const stateHandler = this.tryGetEffectsHandler(effectType);

    if (stateHandler) {
      stateHandler.applyEffects(effectType, payload);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    Assertion.assertValue(actionType, 'actionType');

    const stateHandler = this.getStateHandlerForAction(actionType);

    stateHandler.dispatch(actionType, params);

    this.applyEffects(actionType as any as StateEffect);
  }


  createCommand(type: CommandType, payload?: any): Command {
    return createCommandAlias(type, payload);
  }


  execute<T>(commandOrType: Command | CommandType): Promise<T> {
    Assertion.assertValue(commandOrType, 'commandOrTypecommand');

    if (typeof commandOrType === 'string') {
      const commandFromCommandType = this.createCommand(commandOrType);

      return this.executeImplementation<T>(commandFromCommandType);
    } else {
      return this.executeImplementation<T>(commandOrType);
    }
  }


  getValue<T>(selector: StateSelector): T {
    Assertion.assertValue(selector, 'selector');

    const stateHandler = this.getStateHandlerForSelector(selector);

    return stateHandler.getValue<T>(selector);
  }


  select<T>(selector: StateSelector, params?: any): EmpObservable<T> {
    Assertion.assertValue(selector, 'selector');

    const stateHandler = this.getStateHandlerForSelector(selector);

    return stateHandler.select<T>(selector, params);
  }


  clearValues() {
    this.registeredHandlers.forEach(x => x.clearValues());
  }


  // private methods


  private afterCommandExecution(command: Command, result: any) {
    const commandResult: CommandResult = { ...command, result };

    this.applyEffects(command.type as unknown as StateEffect, commandResult);
    this.endProcessing();
  }


  private executeImplementation<U>(command: Command): Promise<U> {
    if (this.isProcessing) {
      throw new Error('PresentationState is processing a previous command. Please try again later.');
    }

    try {
      this.startProcessing();

      const commandHandler = this.selectCommandHandler(command);

      return commandHandler.execute<U>(command)
        .then(x => {
          this.afterCommandExecution(command, x);
          return x;

        }).catch(e => {
          this.whenCommandExecutionFails(command, e);
          throw e;
        });

    } catch (e) {
      this.endProcessing();
      throw e;
    }
  }


  private endProcessing(): void {
    this.processing = false;
    this.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, false);
  }


  private selectCommandHandler(command: Command): PresentationHandler {
    for (const handler of this.registeredHandlers) {
      if (handler.commands.includes(command.type)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(
      `There is not defined a command handler for command type '${command.type}'.`
    );
  }


  private startProcessing(): void {
    this.processing = true;
    this.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, true);
  }


  private whenCommandExecutionFails(command: Command, error: any) {
    this.endProcessing();

    console.log(`There was a problem executing command ${command.type}.`, error);
  }


  private getStateHandlerForAction(actionType: string) {
    for (const handler of this.registeredHandlers) {
      if (handler.actions.includes(actionType)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(
      `There is not defined a presentation state handler for action '${actionType}'.`
    );
  }


  private getStateHandlerForSelector(selector: StateSelector): PresentationHandler {
    for (const handler of this.registeredHandlers) {
      if (handler.selectors.includes(selector)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(
      `There is not defined a presentation state handler for selector '${selector}'.`
    );
  }


  private tryGetEffectsHandler(effectType: StateEffect): PresentationHandler | undefined {
    for (const handler of this.registeredHandlers) {
      if (handler.effects.includes(effectType as unknown as string)) {
        return handler;
      }
    }
    return undefined;
  }

}
