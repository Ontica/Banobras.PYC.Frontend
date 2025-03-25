/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EventEmitter } from '@angular/core';

import { EventInfo } from '@app/core';


export function sendEvent<T>(eventEmitter: EventEmitter<EventInfo>, eventType: any, payload?: T) {
  const event: EventInfo = {
    type: eventType,
    payload
  };

  eventEmitter.emit(event);
}


export function sendEventIf<T>(condition: boolean, eventEmitter: EventEmitter<EventInfo>, eventType: any, payload?: T) {
  if (condition) {
    sendEvent(eventEmitter, eventType, payload);
  }
}
