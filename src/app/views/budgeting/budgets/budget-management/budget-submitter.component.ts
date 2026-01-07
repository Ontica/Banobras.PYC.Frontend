/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEventIf } from '@app/shared/utils';

import { ObjectTypes, BudgetRequestFields } from '@app/models';

export enum BudgetSubmitterEventType {
  COMMIT   = 'BudgetSubmitterComponent.Event.CommitClicked',
  EXERCISE = 'BudgetSubmitterComponent.Event.ExerciseClicked',
  APPROVE   = 'BudgetSubmitterComponent.Event.ApproveClicked',
  REQUEST  = 'BudgetSubmitterComponent.Event.RequestClicked',
  VALIDATE = 'BudgetSubmitterComponent.Event.ValidateClicked',
}

@Component({
  selector: 'emp-bdg-budget-submitter',
  templateUrl: './budget-submitter.component.html',
})
export class BudgetSubmitterComponent {

  @Input() baseObjectType: ObjectTypes = null;

  @Input() baseObjectUID = '';

  @Input() baseObjectName = '';

  @Input() budgetTotal: number = null;

  @Input() canApprove = false;

  @Input() canCommit = false;

  @Input() canExercise = false;

  @Input() canRequest = false;

  @Input() canValidate = false;

  @Output() budgetSubmitterEvent = new EventEmitter<EventInfo>();

  eventType = BudgetSubmitterEventType;


  constructor(private messageBox: MessageBoxService) { }


  get baseObjectTypeName(): string {
    switch (this.baseObjectType) {
      case ObjectTypes.REQUISITION: return 'REQUISICIÓN';
      case ObjectTypes.CONTRACT: return 'CONTRATO';
      case ObjectTypes.CONTRACT_ORDER: return 'ENTREGA';
      case ObjectTypes.EXPENSE: return 'GASTO O REEMBOLSO';
      case ObjectTypes.PURCHASE: return 'COMPRA MENOR';
      case ObjectTypes.PAYMENT_ORDER: return 'INSTRUCCIÓN DE PAGO';
      default: return 'OBJETO INDEFINIDO';
    }
  }


  onEventButtonClicked(eventType: BudgetSubmitterEventType) {
    this.showConfirmMessage(eventType);
  }


  private showConfirmMessage(eventType: BudgetSubmitterEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.budgetSubmitterEvent, eventType, { dataFields: this.getDataFields() }));
  }


  private getConfirmType(eventType: BudgetSubmitterEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case BudgetSubmitterEventType.COMMIT:
      case BudgetSubmitterEventType.EXERCISE:
      case BudgetSubmitterEventType.REQUEST:
      case BudgetSubmitterEventType.APPROVE:
      case BudgetSubmitterEventType.VALIDATE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: BudgetSubmitterEventType): string {
    switch (eventType) {
      case BudgetSubmitterEventType.APPROVE:   return 'Solicitar aprobación';
      case BudgetSubmitterEventType.EXERCISE: return 'Ejercer presupuesto';
      case BudgetSubmitterEventType.COMMIT:   return 'Solicitar compromiso presupuestal';
      case BudgetSubmitterEventType.REQUEST:  return 'Solicitar suficiencia presupuestal';
      case BudgetSubmitterEventType.VALIDATE: return 'Validar suficiencia';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: BudgetSubmitterEventType): string {
    const totalText = !!this.budgetTotal ?
      ` por un importe antes de impuestos de <strong>${FormatLibrary.numberWithCommas(this.budgetTotal, '1.2-2') }</strong>` : '';

    switch (eventType) {
      case BudgetSubmitterEventType.APPROVE:
        return `Esta operación solicitará la aprobación para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Solicito la aprobación?`;
      case BudgetSubmitterEventType.EXERCISE:
        return `Esta operación ejercerá el presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Ejerzo el presupuesto?`;
      case BudgetSubmitterEventType.COMMIT:
        return `Esta operación solicitará el compromiso presupuestal para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Solicito el compromiso presupuestal?`;
      case BudgetSubmitterEventType.REQUEST:
        return `Esta operación solicitará el presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Solicito el presupuesto?`;
      case BudgetSubmitterEventType.VALIDATE:
        return `Esta operación verificará la disponibilidad de presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Realizo la verificación?`;
      default: return '';
    }
  }


  private getDataFields(): BudgetRequestFields {
    return {
      baseObjectTypeUID: this.baseObjectType,
      baseObjectUID: this.baseObjectUID,
    };
  }

}
