/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EventEmitter } from '@angular/core';

import { EventInfo } from '@app/core';


export function sendEvent(eventEmitter: EventEmitter<EventInfo>, eventType: any, payload?: any) {
  const event: EventInfo = {
    type: eventType,
    payload
  };

  eventEmitter.emit(event);
}
