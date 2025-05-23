/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';


export type ConfirmSubmitType = 'Delete' | 'SendToAuthorization' | 'Authorize' | 'Reject' | 'Close';


export enum ConfirmSubmitModalEventType {
  CLOSE_BUTTON_CLICKED  = 'ConfirmSubmitModalComponent.Event.CloseButtonClicked',
  SUBMIT_BUTTON_CLICKED = 'ConfirmSubmitModalComponent.Event.SubmitButtonClicked',
}

@Component({
  selector: 'emp-ng-confirm-submit-modal',
  templateUrl: './confirm-submit-modal.component.html',
})
export class ConfirmSubmitModalComponent {

  @Input() entityPronoun = 'la';

  @Input() entityText = 'transacción';

  @Input() entityUID = '';

  @Input() entityNo = '';

  @Input() entityType = '';

  @Input() party = '';

  @Input() mode: ConfirmSubmitType = null;

  @Output() confirmSubmitModalEvent = new EventEmitter<EventInfo>();

  notes = '';


  get showWarningColor(): boolean {
    return ['Delete', 'Reject'].includes(this.mode);
  }


  get notesRequired(): boolean {
    return this.mode === 'Reject';
  }


  get titleText(): string {
    switch (this.mode) {
      case 'Delete': return `Eliminar ${this.entityText}`;
      case 'SendToAuthorization': return 'Enviar a autorización';
      case 'Authorize': return `Autorizar ${this.entityText}`;
      case 'Reject': return `Rechazar ${this.entityText}`;
      case 'Close': return `Cerrar ${this.entityText}`;
      default: return 'Realizar operación'
    }
  }


  get actionText(): string {
    switch (this.mode) {
      case 'Delete': return 'eliminará';
      case 'SendToAuthorization': return 'enviará a autorización';
      case 'Authorize': return 'autorizará';
      case 'Reject': return 'rechazará';
      case 'Close': return 'cerrará';
      default: return 'realizará';
    }
  }


  get questionText(): string {
    switch (this.mode) {
      case 'Delete': return 'Elimino';
      case 'SendToAuthorization': return 'Envío a autorización';
      case 'Authorize': return 'Autorizo';
      case 'Reject': return 'Rechazo';
      case 'Close': return 'Cierro';
      default: return 'Realizo';
    }
  }


  get submitText(): string {
    switch (this.mode) {
      case 'Delete': return 'Eliminar';
      case 'SendToAuthorization': return 'Enviar';
      case 'Authorize': return 'Autorizar';
      case 'Reject': return 'Rechazar';
      case 'Close': return 'Cerrar';
      default: return 'Aceptar';
    }
  }


  get isReady(): boolean {
    return this.notesRequired ? !!this.notes : true;
  }


  onCloseButtonClicked() {
    sendEvent(this.confirmSubmitModalEvent, ConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    sendEvent(this.confirmSubmitModalEvent, ConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED,
      { entityUID: this.entityUID, notes: this.notes }
    );
  }

}
