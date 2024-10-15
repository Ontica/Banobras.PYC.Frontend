/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ExplorerOperation, ExplorerOperationCommand, PaymentOrderDescriptor, PaymentsOrdersOperationsList,
         PaymentsOrdersOperationType } from '@app/models';


export enum PaymentsOrdersListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'PaymentsOrdersListControlsComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-pmt-payments-orders-list-controls',
  templateUrl: './payments-orders-list-controls.component.html',
})
export class PaymentsOrdersListControlsComponent {

  @Input() selection = new SelectionModel<PaymentOrderDescriptor>(true, []);

  @Output() paymentsOrdersListControlsEvent = new EventEmitter<EventInfo>();

  operationsList: ExplorerOperation[] = PaymentsOrdersOperationsList;

  operationSelected: ExplorerOperation = null;


  constructor(private messageBox: MessageBoxService) { }


  get operationValid() {
    if (isEmpty(this.operationSelected)) {
      return false;
    }

    return true;
  }


  onOperationChanges(operation: ExplorerOperation) {

  }


  onExecuteOperationClicked() {
    if (!this.operationValid) {
      this.messageBox.showError('Operación no válida. Favor de verificar los datos.');
      return;
    }

    this.validateShowConfirmMessage();
  }


  private validateShowConfirmMessage() {
    if (this.operationSelected.uid === PaymentsOrdersOperationType.excel) {
      this.emitExecuteOperation();
    } else {
      this.showConfirmMessage();
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.uid === PaymentsOrdersOperationType.delete ?
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
      case PaymentsOrdersOperationType.delete:
      case PaymentsOrdersOperationType.print:
        return `${this.operationSelected.name} las ordenes de pago`;
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (this.operationSelected.uid as PaymentsOrdersOperationType) {
      case PaymentsOrdersOperationType.delete:
        operation = 'eliminará';
        question = '¿Elimino las ordenes de pago?';
        break;
      case PaymentsOrdersOperationType.print:
        operation = 'imprimirá';
        question = '¿Imprimo las ordenes de pago?';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} las ` +
           `<strong> ${this.selection.selected.length} ordenes de pago</strong> seleccionadas.` +
           `<br><br>${question}`;
  }


  private emitExecuteOperation() {
    const command: ExplorerOperationCommand = {
      operation: this.operationSelected.uid,
      items: this.selection.selected.map(r => r.uid),
    };

    sendEvent(this.paymentsOrdersListControlsEvent,
      PaymentsOrdersListControlsEventType.EXECUTE_OPERATION_CLICKED, command);
  }

}
