/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum AccessControlControlsEventType {
  EXPORT_BUTTON_CLICKED = 'AccessControlControlsComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-ng-access-control-controls',
  templateUrl: './access-control-controls.component.html',
})
export class AccessControlControlsComponent {

  @Input() filter = '';

  @Output() accessControlControlsEvent = new EventEmitter<EventInfo>();


  onExportButtonClicked() {
    sendEvent(this.accessControlControlsEvent, AccessControlControlsEventType.EXPORT_BUTTON_CLICKED);
  }

}
