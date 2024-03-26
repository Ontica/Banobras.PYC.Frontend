/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion } from '../general/assertion';
import { Entity } from '../data-types/core-types';

import { StateSelector } from './presentation-types';
import { PresentationHandler } from './presentation.handler';
import { Exception } from '../general/exception';


export class StateUpdaterUtilities {


  constructor(private stateHandler: PresentationHandler,
              private setValueFunction: (selector: StateSelector, value: any) => void) { }


  appendToStart(arraySelector: StateSelector, itemToAppend: any): void {
    Assertion.assertValue(arraySelector, 'arraySelector');
    Assertion.assertValue(itemToAppend, 'itemToAppend');

    const currentArray = this.stateHandler.getValue(arraySelector);

    if (!(currentArray instanceof Array)) {
      throw new Exception(`State selector ${arraySelector} has a value that is not an array.`);
    }

    let newArray = [];
    if (itemToAppend instanceof Array) {
      newArray = itemToAppend.concat(currentArray);
    } else {
      newArray = [itemToAppend].concat(currentArray);
    }
    this.setValueFunction.call(this.stateHandler, arraySelector, newArray);
  }


  removeEntity(arraySelector: StateSelector, entity: Entity): void {
    Assertion.assertValue(arraySelector, 'arraySelector');
    Assertion.assertValue(entity, 'entity');

    const currentArray = this.stateHandler.getValue(arraySelector);

    if (!(currentArray instanceof Array)) {
      throw new Exception(`State selector ${arraySelector} has a value that is not an array.`);
    }

    const index = currentArray.findIndex(x => x.uid === entity.uid);

    if (index !== -1) {
      const newArray = currentArray.splice(index);

      this.setValueFunction.call(this.stateHandler, arraySelector, newArray);
    }
  }


  replaceEntity(arraySelector: StateSelector, entity: Entity): void {
    Assertion.assertValue(arraySelector, 'arraySelector');
    Assertion.assertValue(entity, 'entity');

    const currentArray = this.stateHandler.getValue(arraySelector);

    if (!(currentArray instanceof Array)) {
      throw new Exception(`State selector ${arraySelector} has a value that is not an array.`);
    }

    const indexOfEntity = currentArray.findIndex(x => x.uid === entity.uid);

    if (indexOfEntity >= 0) {
      const newArray = [...currentArray];

      newArray[indexOfEntity] = entity;

      this.setValueFunction.call(this.stateHandler, arraySelector, newArray);
    }
  }

}
