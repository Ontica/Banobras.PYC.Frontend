/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PayableDescriptor, PayablesOperation, PayablesOperationCommand, PayablesOperationsList,
         PayablesOperationType } from '@app/models';


export enum PayablesListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'PayablesListControlsComponent.Event.ExecuteOperationClicked',
}


@Component({
  selector: 'emp-pmt-payables-list-controls',
  templateUrl: './payables-list-controls.component.html',
})
export class PayablesListControlsComponent {

  @Input() selection = new SelectionModel<PayableDescriptor>(true, []);

  @Output() payablesListControlsEvent = new EventEmitter<EventInfo>();

  operationsList: PayablesOperation[] = PayablesOperationsList;

  operationSelected: PayablesOperation = null;


  constructor(private messageBox: MessageBoxService) { }


  get operationValid() {
    if (isEmpty(this.operationSelected)) {
      return false;
    }

    return true;
  }


  onOperationChanges(operation: PayablesOperation) {

  }


  onExecuteOperationClicked() {
    if (!this.operationValid) {
      this.messageBox.showError('Operación no válida. Favor de verificar los datos.');
      return;
    }

    this.validateShowConfirmMessage();
  }


  private validateShowConfirmMessage() {
    if (this.operationSelected.uid === PayablesOperationType.excel) {
      this.emitExecuteOperation();
    } else {
      this.showConfirmMessage();
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.uid === PayablesOperationType.delete ?
      'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(), this.getConfirmTitle(), type)
      .firstValue()
      .then(x => {
        if (x) {
          this.emitExecuteOperation();
        }
      });
  }


  private getConfirmTitle(): string {
    switch (this.operationSelected.uid) {
      case PayablesOperationType.delete:
      case PayablesOperationType.print:
        return `${this.operationSelected.name} las obligaciones de pago`;
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (this.operationSelected.uid as PayablesOperationType) {
      case PayablesOperationType.delete:
        operation = 'eliminará';
        question = '¿Elimino las obligaciones de pago?';
        break;
      case PayablesOperationType.print:
        operation = 'imprimirá';
        question = '¿Imprimo las obligaciones de pago?';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} las ` +
           `<strong> ${this.selection.selected.length} obligaciones de pago</strong> seleccionadas.` +
           `<br><br>${question}`;
  }


  private emitExecuteOperation() {
    const command: PayablesOperationCommand = {
      operation: this.operationSelected.uid,
      payables: this.selection.selected.map(r => r.uid),
    };

    sendEvent(this.payablesListControlsEvent,
      PayablesListControlsEventType.EXECUTE_OPERATION_CLICKED, command);
  }

}
