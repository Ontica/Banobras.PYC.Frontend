/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Entity, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { ExplorerOperation, ExplorerOperationCommand, ExplorerOperationType } from '@app/models';


export enum ListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'ListControlsComponent.Event.ExecuteOperationClicked',
  EXPORT_BUTTON_CLICKED     = 'ListControlsComponent.Event.ExportButtonClicked',
}

export interface ListControlConfig {
  itemsName?: string;
  itemsPronouns?: string;
  selectionMessage?: string;
  showExportButton?: boolean;
}


const DefaultListControlConfig: ListControlConfig = {
  itemsName: 'elementos',
  itemsPronouns: 'los',
  selectionMessage: 'seleccionados',
  showExportButton: false,
};


@Component({
  selector: 'emp-ng-list-controls',
  templateUrl: './list-controls.component.html',
})
export class ListControlsComponent {

  @Input()
  get config() {
    return this.listControlConfig;
  }
  set config(value: ListControlConfig) {
    this.listControlConfig = Object.assign({}, DefaultListControlConfig, value);
  }

  @Input() selection = new SelectionModel<Entity>(true, []);

  @Input() operationsList: ExplorerOperation[] = [];

  @Output() listControlsEvent = new EventEmitter<EventInfo>();

  listControlConfig = DefaultListControlConfig;

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


  onExportButtonClicked() {
    sendEvent(this.listControlsEvent, ListControlsEventType.EXPORT_BUTTON_CLICKED);
  }


  private validateShowConfirmMessage() {
    if (this.operationSelected.showConfirm) {
      this.showConfirmMessage();
    } else {
      this.emitExecuteOperation();
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.isConfirmWarning ? 'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(), this.getConfirmTitle(), type)
      .firstValue()
      .then(x => {
        if (x) {
          this.emitExecuteOperation();
        }
      });
  }


  private getConfirmTitle(): string {
    return `${this.operationSelected.name} ${this.config.itemsPronouns} ${this.config.itemsName}`;
  }


  private getConfirmMessage(): string {
    let operation = this.operationSelected.confirmOperationMessage ?? 'modificará';

    let question = this.operationSelected.confirmQuestionMessage ?
      `¿${this.operationSelected.confirmQuestionMessage} ${this.config.itemsPronouns} ${this.config.itemsName}?` :
      '¿Continuo con la operación?';

    return `Esta operación ${operation} ${this.config.itemsPronouns} ` +
           `<strong>${this.selection.selected.length} ${this.config.itemsName}</strong> ` +
           `${this.config.selectionMessage}. <br><br>${question}`;
  }


  private emitExecuteOperation() {
    const operation: ExplorerOperationType = this.operationSelected.uid as ExplorerOperationType;
    const command: ExplorerOperationCommand = { items: this.selection.selected.map(r => r.uid) };
    sendEvent(this.listControlsEvent, ListControlsEventType.EXECUTE_OPERATION_CLICKED, { operation, command });
  }

}
