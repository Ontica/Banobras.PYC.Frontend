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
  REQUEST              = 'BudgetSubmitterComponent.Event.RequestClicked',
  REQUEST_MODIFICATION = 'BudgetSubmitterComponent.Event.RequestModificationClicked',
  VALIDATE             = 'BudgetSubmitterComponent.Event.ValidateClicked',
  EXECUTE_BUDGET       = 'BudgetSubmitterComponent.Event.ExecuteBudgetClicked',
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

  @Input() canRequest = false;

  @Input() canRequestModification = false;

  @Input() canValidate = false;

  @Input() canExecuteBudget = false;

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
      case ObjectTypes.PAYMENT_ORDER: return 'ORDEN DE PAGO';
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
      case BudgetSubmitterEventType.REQUEST:
      case BudgetSubmitterEventType.REQUEST_MODIFICATION:
      case BudgetSubmitterEventType.EXECUTE_BUDGET:
      case BudgetSubmitterEventType.VALIDATE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: BudgetSubmitterEventType): string {
    switch (eventType) {
      case BudgetSubmitterEventType.REQUEST: return 'Solicitar suficiencia presupuestal';
      case BudgetSubmitterEventType.REQUEST_MODIFICATION: return 'Solicitar modificación presupuestal';
      case BudgetSubmitterEventType.EXECUTE_BUDGET: return 'Ejercer presupuesto';
      case BudgetSubmitterEventType.VALIDATE: return 'Validar suficiencia';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: BudgetSubmitterEventType): string {
    const totalText = !!this.budgetTotal ?
      ` por un total de <strong>${FormatLibrary.numberWithCommas(this.budgetTotal, '1.2-2') }</strong>` : '';

    switch (eventType) {
      case BudgetSubmitterEventType.REQUEST:
        return `Esta operación solicitará el presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Envio la solicitud?`;
      case BudgetSubmitterEventType.REQUEST_MODIFICATION:
        return `Esta operación solicitará la modificación presupuestal para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Solicitó la modificación presupuestal?`;
      case BudgetSubmitterEventType.EXECUTE_BUDGET:
        return `Esta operación ejercerá el presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Ejerzo el presupuesto?`;
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
