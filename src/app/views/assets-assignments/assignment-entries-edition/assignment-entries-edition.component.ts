/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { AlertService } from '@app/shared/services';

import { FilePreviewComponent } from '@app/shared/containers';

import { AssetsAssignmentsDataService } from '@app/data-services';

import { AssetsAssignmentsOperationType, AssetsTransactionEntry, AssetsAssignmentsOperationCommand,
         AssetsAssignmentsOperationData, EmptyAssetsAssignmentsOperationData, ExplorerOperationResult,
         FileReport } from '@app/models';

import { AssignmentEntriesTableEventType } from './assignment-entries-table.component';

import { AssignmentsOperationDataEventType } from '../assignments-operation/assignments-operation-data.component';


export enum AssignmentEntriesEditionEventType {
  EXECUTED = 'AssetsAssignmentEntriesEditionComponent.Event.Executed',
}

@Component({
  selector: 'emp-inv-assignment-entries-edition',
  templateUrl: './assignment-entries-edition.component.html',
})
export class AssetsAssignmentEntriesEditionComponent implements OnChanges {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() assignmentUID: string = '';

  @Input() entries: AssetsTransactionEntry[] = [];

  @Input() canEdit = false;

  @Output() assignmentEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';

  displayOperationDataModal = false;

  selectedOperationData: AssetsAssignmentsOperationData = Object.assign({}, EmptyAssetsAssignmentsOperationData);


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private alertService: AlertService) { }


  ngOnChanges(){
    this.filter = '';
  }


  onAssignmentEntriesTableEvent(event: EventInfo) {
    switch (event.type as AssignmentEntriesTableEventType) {
      case AssignmentEntriesTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.setSelectedOperationData(event.payload.operation as AssetsAssignmentsOperationType,
                                      event.payload.command.items);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onAssignmentsOperationDataEvent(event: EventInfo) {
    switch (event.type as AssignmentsOperationDataEventType) {
      case AssignmentsOperationDataEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedOperationData(null, []);
        return;
      case AssignmentsOperationDataEventType.EXECUTE_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.bulkOperationAssignmentEntries(event.payload.operation as AssetsAssignmentsOperationType,
                                            event.payload.command as AssetsAssignmentsOperationCommand);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private bulkOperationAssignmentEntries(operation: AssetsAssignmentsOperationType,
                                         command: AssetsAssignmentsOperationCommand) {
    this.submitted = true;

    this.assignmentsData.bulkOperationAssignmentEntries(this.assignmentUID, operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationAssignmentEntriesResponse(operation, x))
      .finally(() => this.submitted = false);
  }


  private resolveBulkOperationAssignmentEntriesResponse(operation: AssetsAssignmentsOperationType,
                                                        result: ExplorerOperationResult) {
    switch (operation) {
      default:
        sendEvent(this.assignmentEntriesEditionEvent, AssignmentEntriesEditionEventType.EXECUTED,
          { assignmentUID: this.assignmentUID });
        this.setSelectedOperationData(null, []);
        this.openFilePreview(result.file);
        this.alertService.openAlert(result.message, 'Ok');
        return;
    }
  }


  private setSelectedOperationData(operation: AssetsAssignmentsOperationType,
                                   assets: string[]) {
    this.selectedOperationData = Object.assign({}, EmptyAssetsAssignmentsOperationData,
      { operation, assets });
    this.displayOperationDataModal = !!operation;
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
