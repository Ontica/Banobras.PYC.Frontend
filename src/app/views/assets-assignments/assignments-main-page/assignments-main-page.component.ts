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

import { AssetsAssignmentDescriptor, AssetsAssignmentHolder, AssetsAssignmentsOperationCommand,
         AssetsAssignmentsOperationData, AssetsAssignmentsOperationType, AssetsAssignmentsQuery,
         EmptyAssetsAssignmentHolder, EmptyAssetsAssignmentsOperationData, EmptyAssetsAssignmentsQuery,
         ExplorerOperationResult } from '@app/models';

import { AssignmentsExplorerEventType } from '../assignments-explorer/assignments-explorer.component';

import { AssignmentsOperationDataEventType } from '../assignments-operation/assignments-operation-data.component';

import { AssignmentTabbedViewEventType } from '../assignment-tabbed-view/assignment-tabbed-view.component';


@Component({
  selector: 'emp-inv-assignments-main-page',
  templateUrl: './assignments-main-page.component.html',
})
export class AssetsAssignmentsMainPageComponent {

  query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  dataList: AssetsAssignmentDescriptor[] = [];

  selectedData: AssetsAssignmentHolder = EmptyAssetsAssignmentHolder;

  displayTabbedView = false;

  displayOperationDataModal = false;

  selectedOperationData: AssetsAssignmentsOperationData = Object.assign({}, EmptyAssetsAssignmentsOperationData);

  fileUrl = '';

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private messageBox: MessageBoxService) { }


  onAssignmentsExplorerEvent(event: EventInfo) {
    switch (event.type as AssignmentsExplorerEventType) {
      case AssignmentsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsAssignmentsQuery);
        this.searchAssignments(this.query);
        return;
      case AssignmentsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsAssignmentsQuery);
        return;
      case AssignmentsExplorerEventType.EXPORT_CLICKED:
        this.exportAssignments(this.query);
        return;
      case AssignmentsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getAssignment(event.payload.item.uid);
        return;
      case AssignmentsExplorerEventType.EXECUTE_OPERATION_CLICKED:
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


  onAssignmentsOperationDataEvent(event: EventInfo) {
    switch (event.type as AssignmentsOperationDataEventType) {
      case AssignmentsOperationDataEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedOperationData(null, []);
        return;
      case AssignmentsOperationDataEventType.EXECUTE_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.bulkOperationAssignments(event.payload.operation,
                                      event.payload.command);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssignmentTabbedViewEvent(event: EventInfo) {
    switch (event.type as AssignmentTabbedViewEventType) {
      case AssignmentTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAssetsAssignmentHolder);
        return;
      case AssignmentTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.assignmentUID, 'event.payload.assignmentUID');
        this.refreshSelectedData(event.payload.assignmentUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchAssignments(query: AssetsAssignmentsQuery) {
    this.isLoading = true;

    this.assignmentsData.searchAssignments(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private exportAssignments(query: AssetsAssignmentsQuery) {
    this.assignmentsData.exportAssignments(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private bulkOperationAssignments(operation: AssetsAssignmentsOperationType,
                                   command: AssetsAssignmentsOperationCommand) {
    this.isLoadingSelection = true;

    this.assignmentsData.bulkOperationAssignments(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationAssignmentsResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getAssignment(assignmentUID: string) {
    this.isLoadingSelection = true;

    this.assignmentsData.getAssignment(assignmentUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshData() {
    this.setSelectedData(EmptyAssetsAssignmentHolder);
    this.searchAssignments(this.query);
  }


  private refreshSelectedData(assignmentUID: string) {
    this.getAssignment(assignmentUID);
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


  private setSelectedOperationData(operation: AssetsAssignmentsOperationType,
                                   assignments: string[]) {
    this.selectedOperationData = Object.assign({}, EmptyAssetsAssignmentsOperationData,
      { operation, assignments });
    this.displayOperationDataModal = !!operation;
  }


  private resolveBulkOperationAssignmentsResponse(operation: AssetsAssignmentsOperationType,
                                                  result: ExplorerOperationResult) {
    switch (operation) {
      default:
        this.setSelectedOperationData(null, []);
        this.refreshData();
        this.messageBox.show(result.message, 'Ejecutar operación');
        return;
    }
  }

}
