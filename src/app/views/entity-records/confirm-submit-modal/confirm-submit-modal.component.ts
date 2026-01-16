/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';


export type ConfirmSubmitType = 'Delete' | 'SendToAuthorization' | 'Authorize' | 'Reject' | 'Close' |
                                'Suspend' | 'Activate' | 'Cancel' |
                                'ClosePayment' | 'RequestPayment' | 'CancelRequestPayment';


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

  @Input() entityFields: {label: string, value: string}[] = [];

  @Input() party = '';

  @Input() mode: ConfirmSubmitType = null;

  @Output() confirmSubmitModalEvent = new EventEmitter<EventInfo>();

  notes = '';


  get showWarningColor(): boolean {
    return ['Delete', 'Reject', 'Suspend', 'Cancel', 'ClosePayment'].includes(this.mode);
  }


  get notesRequired(): boolean {
    return ['Reject', 'ClosePayment'].includes(this.mode);
  }


  get titleText(): string {
    switch (this.mode) {
      case 'Delete': return `Eliminar ${this.entityText}`;
      case 'SendToAuthorization': return 'Enviar a autorización';
      case 'Authorize': return `Autorizar ${this.entityText}`;
      case 'Reject': return `Rechazar ${this.entityText}`;
      case 'Close': return `Cerrar ${this.entityText}`;
      case 'Suspend': return `Suspender ${this.entityText}`;
      case 'Activate': return `Activar ${this.entityText}`;
      case 'Cancel': return `Cancelar ${this.entityText}`;
      case 'ClosePayment': return `Marcar como pagada ${this.entityPronoun} ${this.entityText}`;
      case 'RequestPayment': return `Enviar pago`;
      case 'CancelRequestPayment': return `Cancelar envío de pago`;
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
      case 'Suspend': return 'suspenderá';
      case 'Activate': return 'activará';
      case 'Cancel': return 'cancelará';
      case 'ClosePayment': return 'marcará como pagada';
      case 'RequestPayment': return 'enviará a pagar';
      case 'CancelRequestPayment': return 'cancelará el envío a pagar de';
      default: return 'realizará';
    }
  }


  get questionText(): string {
    switch (this.mode) {
      case 'Delete': return `¿Elimino ${this.entityPronoun} ${this.entityText}?`;
      case 'SendToAuthorization': return `¿Envío a autorización ${this.entityPronoun} ${this.entityText}?`;
      case 'Authorize': return `¿Autorizo ${this.entityPronoun} ${this.entityText}?`;
      case 'Reject': return `¿Rechazo ${this.entityPronoun} ${this.entityText}?`;
      case 'Close': return `¿Cierro ${this.entityPronoun} ${this.entityText}?`;
      case 'Suspend': return `¿Suspendo ${this.entityPronoun} ${this.entityText}?`;
      case 'Activate': return `¿Activo ${this.entityPronoun} ${this.entityText}?`;
      case 'Cancel': return `¿Cancelo ${this.entityPronoun} ${this.entityText}?`;
      case 'ClosePayment': return `¿Marco como pagada ${this.entityPronoun} ${this.entityText}?`;
      case 'RequestPayment': return `¿Envio el pago?`;
      case 'CancelRequestPayment': return `¿Cancelo el envío del pago?`;
      default: return `¿Realizo ${this.entityPronoun} ${this.entityText}?`;
    }
  }


  get submitText(): string {
    switch (this.mode) {
      case 'Delete': return 'Eliminar';
      case 'SendToAuthorization': return 'Enviar';
      case 'Authorize': return 'Autorizar';
      case 'Reject': return 'Rechazar';
      case 'Close': return 'Cerrar';
      case 'Suspend': return 'Suspender';
      case 'Activate': return 'Activar';
      case 'Cancel': return 'Aceptar';
      case 'ClosePayment': return 'Aceptar';
      case 'RequestPayment': return 'Aceptar';
      case 'CancelRequestPayment': return 'Aceptar';
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
