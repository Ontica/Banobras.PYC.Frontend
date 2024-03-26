/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface ModalDialogConfig {
  height?: string;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  backdropClick?: boolean;
}


const DefaultModalDialogConfig: ModalDialogConfig = {
  height: 'auto',
  width: 'auto',
  maxWidth: '100%',
  maxHeight: '100%',
  minWidth: '',
  minHeight: '',
  backdropClick: false,
};


@Component({
  selector: 'emp-ng-modal-window',
  templateUrl: './modal-window.html',
  styleUrls: ['./modal-window.scss']
})
export class ModalWindowComponent {

  @Input() title = '';

  @Input()
  get config() {
    return this.modalConfig;
  }
  set config(value: ModalDialogConfig) {
    this.modalConfig = Object.assign({}, DefaultModalDialogConfig, value);
  }

  @Output() backdropClick = new EventEmitter();

  modalConfig = DefaultModalDialogConfig;


  onBackdropClick() {
    if (this.config.backdropClick) {
      this.backdropClick.emit();
    }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
