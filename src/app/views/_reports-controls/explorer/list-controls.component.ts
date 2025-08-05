/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, FlexibleIdentifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { ExplorerOperation, ExplorerOperationCommand, ExplorerOperationType } from '@app/models';


export enum ListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'ListControlsComponent.Event.ExecuteOperationClicked',
  STATUS_CHANGED            = 'ListControlsComponent.Event.StatusChanged',
  FILTER_CHANGED            = 'ListControlsComponent.Event.FilterChanged',
  EXPORT_BUTTON_CLICKED     = 'ListControlsComponent.Event.ExportButtonClicked',
}

export interface ListControlConfig {
  showOperationControl?: boolean;
  showExportButton?: boolean;
  showStatus?: boolean;
  showSearcher?: boolean;
  showDivider?: boolean;
  labelsAside?: 'left' | 'top';
  itemsName?: string;
  itemsPronouns?: string;
  selectionMessage?: string;
  statusSelectFirst?: boolean;
  searcherAside?: 'left' | 'right';
  searcherPlaceholder?: string;
  searcherText?: string;
}


const DefaultListControlConfig: ListControlConfig = {
  showOperationControl: true,
  showExportButton: false,
  showStatus: false,
  showSearcher: false,
  showDivider: true,
  labelsAside: 'left',
  itemsName: 'elementos',
  itemsPronouns: 'los',
  selectionMessage: 'seleccionados',
  statusSelectFirst: false,
  searcherAside: 'left',
  searcherPlaceholder: 'Buscar...',
  searcherText: null,
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

  @Input() selection = new SelectionModel<{uid?: string, id?: number}>(true, []);

  @Input() operationsList: ExplorerOperation[] = [];

  @Input() statusList: FlexibleIdentifiable[] = [];

  @Input() filter = null;

  @Input() status = null;

  @Output() listControlsEvent = new EventEmitter<EventInfo>();

  listControlConfig = DefaultListControlConfig;

  operationSelected: ExplorerOperation = null;


  constructor(private messageBox: MessageBoxService) { }


  get displayOperationControl(): boolean {
    return this.config.showOperationControl && this.selection.selected.length > 0;
  }


  get operationValid() {
    if (isEmpty(this.operationSelected)) {
      return false;
    }

    return true;
  }


  onOperationChanges() {

  }


  onExecuteOperationClicked() {
    if (!this.operationValid) {
      this.messageBox.showError('Operación no válida. Favor de verificar los datos.');
      return;
    }

    this.validateShowConfirmMessage();
  }


  onStatusChanges() {
    sendEvent(this.listControlsEvent, ListControlsEventType.STATUS_CHANGED,
      { status: this.status });
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.listControlsEvent, ListControlsEventType.FILTER_CHANGED,
      { filter: this.filter });
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
    return this.operationSelected.confirmTitleWithoutName ?
      `${this.operationSelected.name}` :
      `${this.operationSelected.name} ${this.config.itemsPronouns} ${this.config.itemsName}`;
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
    const command: ExplorerOperationCommand = { items: this.getItems() };
    sendEvent(this.listControlsEvent, ListControlsEventType.EXECUTE_OPERATION_CLICKED, { operation, command });
  }


  private getItems(): any[] {
    if (this.selection.selected.some(x => x.uid)) {
      return this.selection.selected.map(r => r.uid);
    }

    if (this.selection.selected.some(x => x.id)) {
      return this.selection.selected.map(r => r.id);
    }

    return [];
  }

}
