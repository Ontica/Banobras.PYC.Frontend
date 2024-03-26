/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import {
  Component, EventEmitter,
  Input, Output
} from '@angular/core';


export interface ExpansionButtonConfig {
  textButtonOpen?: string;
  textButtonClose?: string;
}


const DefaultExpansionButtonConfig: ExpansionButtonConfig = {
  textButtonOpen: 'Agregar',
  textButtonClose: 'Cancelar',
};


@Component({
  selector: 'emp-ng-expansion-button',
  templateUrl: './expansion-button.component.html',
  styleUrls: ['./expansion-button.component.scss']
})
export class ExpansionButtonComponent {

  @Input() panelState = false;

  @Output() panelStateChange = new EventEmitter<boolean>();

  @Input()
  get config() {
    return this.expansionButtonConfig;
  }
  set config(value: ExpansionButtonConfig) {
    this.expansionButtonConfig = Object.assign({}, DefaultExpansionButtonConfig, value);
  }

  @Output() backdropClick = new EventEmitter();

  expansionButtonConfig = DefaultExpansionButtonConfig;

  setPanelState(state: boolean) {
    this.panelState = state;
    this.panelStateChange.emit(this.panelState);
  }

}
