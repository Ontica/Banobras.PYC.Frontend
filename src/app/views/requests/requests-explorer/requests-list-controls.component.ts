/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { ExplorerOperation, ExplorerOperationCommand, RequestDescriptor, RequestsOperationList,
         RequestsOperationType } from '@app/models';

export enum RequestsListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'RequestsListControlsComponent.Event.ExecuteOperationClicked',
}


@Component({
  selector: 'emp-pyc-requests-list-controls',
  templateUrl: './requests-list-controls.component.html',
})
export class RequestsListControlsComponent {

  @Input() selection = new SelectionModel<RequestDescriptor>(true, []);

  @Output() requestsListControlsEvent = new EventEmitter<EventInfo>();

  operationSelected: ExplorerOperation = null;

  operationsList: ExplorerOperation[] = RequestsOperationList;


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
    if (this.operationSelected.uid === RequestsOperationType.excel) {
      this.emitExecuteOperation();
    } else {
      this.showConfirmMessage();
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.uid === RequestsOperationType.delete ?
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
    switch (this.operationSelected.uid as RequestsOperationType) {
      case RequestsOperationType.delete:
      case RequestsOperationType.print:
        return `${this.operationSelected.name} las solicitudes`;
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (this.operationSelected.uid as RequestsOperationType) {
      case RequestsOperationType.delete:
        operation = 'eliminará';
        question = '¿Elimino la solicitudes?';
        break;
      case RequestsOperationType.print:
        operation = 'imprimirá';
        question = '¿Imprimo las solicitudes?';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} las ` +
           `<strong> ${this.selection.selected.length} solicitudes</strong> seleccionadas.` +
           `<br><br>${question}`;
  }


  private emitExecuteOperation() {
    const command: ExplorerOperationCommand = {
      operation: this.operationSelected.uid,
      items: this.selection.selected.map(r => r.uid),
    };

    sendEvent(this.requestsListControlsEvent,
      RequestsListControlsEventType.EXECUTE_OPERATION_CLICKED, command);
  }

}
