/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { AssetsAssignmentsDataService } from '@app/data-services';

import { AssetsOperationType, AssetsTransactionEntry, ExplorerOperationCommand,
         ExplorerOperationResult } from '@app/models';

import { AssignmentEntriesTableEventType } from './assignment-entries-table.component';


export enum AssignmentEntriesEditionEventType {
  EXECUTED = 'AssetsAssignmentEntriesEditionComponent.Event.Executed',
}

@Component({
  selector: 'emp-inv-assignment-entries-edition',
  templateUrl: './assignment-entries-edition.component.html',
})
export class AssetsAssignmentEntriesEditionComponent implements OnChanges {

  @Input() assignmentUID: string = '';

  @Input() entries: AssetsTransactionEntry[] = [];

  @Input() canEdit = false;

  @Output() assignmentEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnChanges(){
    this.filter = '';
  }


  onAssignmentEntriesTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as AssignmentEntriesTableEventType) {
      case AssignmentEntriesTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.bulkOperationAssignmentEntries(event.payload.operation as AssetsOperationType,
                                           event.payload.command as ExplorerOperationCommand);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private bulkOperationAssignmentEntries(operation: AssetsOperationType, command: ExplorerOperationCommand) {
    this.submitted = true;

    this.assignmentsData.bulkOperationAssignmentEntries(this.assignmentUID, operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationAssignmentEntriesResponse(operation, x))
      .finally(() => this.submitted = false);
  }


  private resolveBulkOperationAssignmentEntriesResponse(operation: AssetsOperationType,
                                                        result: ExplorerOperationResult) {
    switch (operation) {
      default:
        const payload = { assignmentUID: this.assignmentUID };
        sendEvent(this.assignmentEntriesEditionEvent, AssignmentEntriesEditionEventType.EXECUTED, payload);
        this.messageBox.show(result.message, 'Ejecutar operación');
        return;
    }
  }

}
