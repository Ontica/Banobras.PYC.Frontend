/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { AssetsAssignmentsDataService } from '@app/data-services';

import { AssetsAssignmentDescriptor, AssetsAssignmentHolder, AssetsAssignmentsQuery, AssetsOperationType,
         EmptyAssetsAssignmentHolder, EmptyAssetsAssignmentsQuery, EmptyBaseActions, ExplorerOperationCommand,
         ExplorerOperationResult } from '@app/models';

import { AssetsAssignmentsExplorerEventType } from '../assignments-explorer/assignments-explorer.component';

import { AssetsAssignmentTabbedViewEventType } from '../assignment-tabbed-view/assignment-tabbed-view.component';


@Component({
  selector: 'emp-pyc-assignments-main-page',
  templateUrl: './assignments-main-page.component.html',
})
export class AssetsAssignmentsMainPageComponent {

  query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  dataList: AssetsAssignmentDescriptor[] = [];

  selectedData: AssetsAssignmentHolder = EmptyAssetsAssignmentHolder;

  displayTabbedView = false;

  fileUrl = '';

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private messageBox: MessageBoxService) { }


  onAssetsAssignmentsExplorerEvent(event: EventInfo) {
    switch (event.type as AssetsAssignmentsExplorerEventType) {
      case AssetsAssignmentsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsAssignmentsQuery);
        this.searchAssetsAssignments(this.query);
        return;
      case AssetsAssignmentsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsAssignmentsQuery);
        return;
      case AssetsAssignmentsExplorerEventType.EXPORT_CLICKED:
        this.exportAssetsAssignments(this.query);
        return;
      case AssetsAssignmentsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getAssetsAssignment(event.payload.item.uid);
        return;
      case AssetsAssignmentsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.bulkOperationAssetsAssignments(event.payload.operation as AssetsOperationType,
                                            event.payload.command as ExplorerOperationCommand);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssetsAssignmentTabbedViewEvent(event: EventInfo) {
    switch (event.type as AssetsAssignmentTabbedViewEventType) {
      case AssetsAssignmentTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAssetsAssignmentHolder);
        return;
      case AssetsAssignmentTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.assignmentUID, 'event.payload.assignmentUID');
        this.refreshSelectedData(event.payload.assignmentUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchAssetsAssignments(query: AssetsAssignmentsQuery) {
    this.isLoading = true;

    this.assignmentsData.searchAssetsAssignments(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private exportAssetsAssignments(query: AssetsAssignmentsQuery) {
    this.assignmentsData.exportAssetsAssignments(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private bulkOperationAssetsAssignments(operation: AssetsOperationType, command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.assignmentsData.bulkOperationAssetsAssignments(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationAssetsAssignmentsResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getAssetsAssignment(assignmentUID: string) {
    this.isLoadingSelection = true;

    this.assignmentsData.getAssetsAssignment(assignmentUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(assignmentUID: string) {
    this.getAssetsAssignment(assignmentUID);
  }


  private setQueryAndClearExplorerData(query: AssetsAssignmentsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyAssetsAssignmentHolder);
  }


  private setDataList(data: AssetsAssignmentDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: AssetsAssignmentHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.assignment);
  }


  private resolveBulkOperationAssetsAssignmentsResponse(operation: AssetsOperationType,
                                                        result: ExplorerOperationResult) {
    switch (operation) {
      default:
        this.messageBox.show(result.message, 'Ejecutar operación');
        this.searchAssetsAssignments(this.query);
        return;
    }
  }

}
