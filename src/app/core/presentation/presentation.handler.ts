/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';

import { Assertion } from '../general/assertion';

import { Cache, Command, EmpObservable, KeyValue, resolve } from '../data-types';

import { ActionType, CommandType, StateEffect, StateSelector } from './presentation-types';

import { StateUpdaterUtilities } from './state-updater.utilities';


export type StateValues = KeyValue[];


export interface PresentationHandler {

  readonly selectors: string[];
  readonly actions: string[];
  readonly commands: string[];
  readonly effects: string[];

  applyEffects(effectType: StateEffect, params?: any): void;

  dispatch(actionType: ActionType, params?: any): void;

  execute<U>(command: Command): Promise<U>;

  getValue<U>(selector: StateSelector): U;

  select<U>(selector: StateSelector, params?: any): EmpObservable<U>;

  clearValues(): void;

}

export interface StateHandlerConfig {
  initialState?: StateValues;
  selectors?: any;
  actions?: any;
  commands?: any;
  effects?: any;
}


export abstract class AbstractPresentationHandler implements PresentationHandler {

  readonly selectors: string[] = [];
  readonly actions: string[] = [];
  readonly commands: string[] = [];
  readonly effects: string[] = [];

  protected stateUpdater: StateUpdaterUtilities;

  private stateItems = new Map<string, BehaviorSubject<any>>();

  private initialState: KeyValue[];


  constructor(config: StateHandlerConfig) {
    Assertion.assertValue(config, 'config');
    Assertion.assertValue(config.selectors, 'config.selectors');


    if (config.initialState) {
      config.initialState.forEach(x => this.stateItems.set(x.key, new BehaviorSubject(x.value)));
      this.initialState = config.initialState;
    }

    this.selectors = Object.keys(config.selectors).map(k => config.selectors[k as StateSelector]);

    if (config.actions) {
      this.actions = Object.keys(config.actions).map(k => config.actions[k as ActionType]);
    }

    if (config.commands) {
      this.commands = Object.keys(config.commands).map(k => config.commands[k as CommandType]);
    }

    if (config.effects) {
      this.effects = Object.keys(config.effects).map(k => config.effects[k]);
    }

    this.stateUpdater = new StateUpdaterUtilities(this, this.setValue);
  }


  applyEffects(effectType: StateEffect, params?: any): void {
    throw this.unhandledCommandOrActionType(effectType);
  }


  dispatch(actionType: ActionType, payload?: any): void {
    throw this.unhandledCommandOrActionType(actionType);
  }


  execute<U>(command: Command): Promise<U> {
    throw this.unhandledCommand(command);
  }


  getValue<U>(selector: StateSelector): U {
    const stateItem = this.getStateMapItem(selector);

    return stateItem.value as U;
  }


  select<U>(selector: StateSelector, params?: any): EmpObservable<U> {
    const stateItem = this.getStateMapItem(selector);

    return new EmpObservable<U>(stateItem.asObservable() as Observable<U>);
  }


  selectMemoized<U>(selector: StateSelector,
                    funct: () => EmpObservable<any>,
                    key: string,
                    defaultValue: any): EmpObservable<U> {
    Assertion.assertValue(key, 'key');

    const cache = this.getMemoizedCache<U>(selector);

    if (cache.has(key)) {
      return new EmpObservable(cache.get(key).asObservable());
    }

    const subject = new BehaviorSubject<U>(defaultValue);

    cache.set(key, subject);

    funct()
      .firstValue()
      .then(x => {
        subject.next(x);
        return x;
      });

    return new EmpObservable(subject.asObservable());
  }


  setMemoized<U>(selector: StateSelector, value: U, key: string): void {
    Assertion.assertValue(key, 'key');

    const cache = this.getMemoizedCache<U>(selector);

    if (cache.has(key)) {
      cache.get(key).next(value);
      return;
    }

    const subject = new BehaviorSubject<U>(value);

    cache.set(key, subject);
  }


  selectFirst<U>(selector: StateSelector, funct: () => any): EmpObservable<U> {
    const stateItem = this.getStateMapItem(selector);

    if (stateItem.value && (Array.isArray(stateItem.value) && stateItem.value.length > 0)) {
      return new EmpObservable<U>(stateItem.asObservable());
    }

    this.setValue(selector, funct());

    return new EmpObservable<U>(this.getSubject<U>(selector).asObservable());
  }


  clearValues(): void {
    if (this.initialState) {
      this.initialState.forEach(x => this.stateItems.set(x.key, new BehaviorSubject(x.value)));
    }
  }


  protected getSubject<U>(selector: StateSelector): BehaviorSubject<U> {
    const stateItem = this.getStateMapItem(selector);

    return stateItem as BehaviorSubject<U>;
  }


  protected setValue(selector: StateSelector, value: any): void;


  protected setValue<U>(selector: StateSelector, value: EmpObservable<any>): Promise<U>;


  protected setValue<U>(selector: StateSelector, value: EmpObservable<any> | any): Promise<U> {
    const stateItem = this.getStateMapItem(selector);

    if (value instanceof Observable) {
      return firstValueFrom<U>(value)
        .then(x => {
          stateItem.next(x);
          return x;
        });
    } else {
      stateItem.next(value);
      return resolve<U>(value);
    }
  }


  protected unhandledCommand(command: Command): never {
    const msg = `${AbstractPresentationHandler.name} is not able to handle command ${command.type}.`;

    throw Assertion.assertNoReachThisCode(msg);
  }


  protected unhandledCommandOrActionType(commandOrActionType: StateEffect | ActionType): never {
    const msg = `${AbstractPresentationHandler.name} is not able to handle ` +
                `action or command '${commandOrActionType}.'`;

    throw Assertion.assertNoReachThisCode(msg);
  }

  // private methods

  private getMemoizedCache<U>(selector: StateSelector): Cache<BehaviorSubject<U>> {
    const stateItem = this.getStateMapItem(selector);

    const cache: Cache<BehaviorSubject<U>> = stateItem.value as Cache<BehaviorSubject<U>>;

    if (!cache) {
      Assertion.assertNoReachThisCode(`Uninitialized cache for selector ${selector}.`);
    }
    return cache;
  }


  private getStateMapItem(selector: StateSelector) {
    if (this.stateItems.has(selector)) {
      return this.stateItems.get(selector);
    }
    throw new Error(`There is not defined a selector with name '${selector}'.`);
  }

}
