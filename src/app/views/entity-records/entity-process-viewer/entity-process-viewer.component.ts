/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface ProcessStep {
  name: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'blocked';
}


@Component({
  selector: 'emp-ng-entity-process-viewer',
  templateUrl: './entity-process-viewer.component.html',
})
export class EntityProcessViewerComponent {

  @Input() title = '';

  @Input() entityName = '';

  @Input() steps: ProcessStep[] = [];

  @Output() closeEvent = new EventEmitter<void>();


  onCloseButtonClicked() {
    this.closeEvent.emit();
  }

}
