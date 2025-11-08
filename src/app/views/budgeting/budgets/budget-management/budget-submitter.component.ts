/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { ObjectTypes, BudgetRequestFields } from '@app/models';

export enum BudgetSubmitterEventType {
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

  @Input() canRequest = false;

  @Input() canValidate = false;

  @Output() budgetSubmitterEvent = new EventEmitter<EventInfo>();

  eventType = BudgetSubmitterEventType;


  constructor(private messageBox: MessageBoxService) { }


  get baseObjectTypeName(): string {
    switch (this.baseObjectType) {
      case ObjectTypes.CONTRACT:
        return 'CONTRATO';
      case ObjectTypes.CONTRACT_ORDER:
        return 'ENTREGA';
      case ObjectTypes.EXPENSE:
        return 'GASTO O REEMBOLSO';
      case ObjectTypes.PURCHASE_ORDER:
        return 'COMPRA MENOR';
      case ObjectTypes.REQUISITION:
        return 'REQUISICIÓN';
      default:
        return 'OBJETO INDEFINIDO';
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
      .then(x => this.validateExecuteOperation(x, eventType));
  }


  private getConfirmType(eventType: BudgetSubmitterEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case BudgetSubmitterEventType.REQUEST:
      case BudgetSubmitterEventType.VALIDATE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: BudgetSubmitterEventType): string {
    switch (eventType) {
      case BudgetSubmitterEventType.REQUEST: return 'Solicitar suficiencia presupuestal';
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
      case BudgetSubmitterEventType.VALIDATE:
        return `Esta operación verificará la disponibilidad de presupuesto para
                <strong>(${this.baseObjectTypeName}) ${this.baseObjectName}</strong>${totalText}.
                <br><br>¿Realizo la verificación?`;
      default: return '';
    }
  }


  private validateExecuteOperation(send: boolean, eventType: BudgetSubmitterEventType) {
    if (send) {
      sendEvent(this.budgetSubmitterEvent, eventType, { dataFields: this.getDataFields() });
    }
  }


  private getDataFields(): BudgetRequestFields {
    return {
      baseObjectTypeUID: this.baseObjectType,
      baseObjectUID: this.baseObjectUID,
    };
  }

}
