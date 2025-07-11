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

import { AssetDescriptor, AssetsOperationType, ExplorerOperationCommand,
         ExplorerOperationResult } from '@app/models';

import { AssetsTableEventType } from '@app/views/assets/assets-explorer/assets-table.component';


export enum AssignmentAssetsEditionEventType {
  EXECUTED = 'AssetsAssignmentAssetsEditionComponent.Event.Executed',
}

@Component({
  selector: 'emp-pyc-assignment-assets-edition',
  templateUrl: './assignment-assets-edition.component.html',
})
export class AssetsAssignmentAssetsEditionComponent implements OnChanges {

  @Input() assignmentUID: string = '';

  @Input() assets: AssetDescriptor[] = [];

  @Input() canEdit = false;

  @Output() assignmentAssetsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnChanges(){
    this.filter = '';
  }


  onAssetsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as AssetsTableEventType) {
      case AssetsTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.bulkOperationAssignmentAssets(event.payload.operation as AssetsOperationType,
                                           event.payload.command as ExplorerOperationCommand);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private bulkOperationAssignmentAssets(operation: AssetsOperationType, command: ExplorerOperationCommand) {
    this.submitted = true;

    this.assignmentsData.bulkOperationAssignmentAssets(this.assignmentUID, operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationAssignmentAssetsResponse(operation, x))
      .finally(() => this.submitted = false);
  }


  private resolveBulkOperationAssignmentAssetsResponse(operation: AssetsOperationType,
                                                       result: ExplorerOperationResult) {
    switch (operation) {
      default:
        const payload = { assignmentUID: this.assignmentUID };
        sendEvent(this.assignmentAssetsEditionEvent, AssignmentAssetsEditionEventType.EXECUTED, payload);
        this.messageBox.show(result.message, 'Ejecutar operación');
        return;
    }
  }

}
