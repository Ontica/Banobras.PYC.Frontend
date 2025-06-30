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

import { EmptyAssetsAssignmentsQuery, AssetsAssignmentsQuery, AssetsAssignmentDescriptor,
         AssetsAssignmentHolder, EmptyAssetsAssignmentHolder, EmptyAssetsAssignmentsDataTable,
         AssetsAssignmentsDataTable } from '@app/models';

import { AssetsAssignmentsExplorerEventType } from '../assignments-explorer/assignments-explorer.component';


@Component({
  selector: 'emp-pyc-assignments-main-page',
  templateUrl: './assignments-main-page.component.html',
})
export class AssetsAssignmentsMainPageComponent {

  query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  dataList: AssetsAssignmentsDataTable = Object.assign({}, EmptyAssetsAssignmentsDataTable);

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
        this.messageBox.showInDevelopment('Exportar resguardos', event.payload);
        return;
      case AssetsAssignmentsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getAssetsAssignment(event.payload.item.uid);
        return;
      case AssetsAssignmentsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  ondAssetsAssignmentTabbedViewEvent(event: EventInfo) {

  }


  private searchAssetsAssignments(query: AssetsAssignmentsQuery) {
    this.isLoading = true;

    this.assignmentsData.searchAssetsAssignments(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
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
    this.dataList = Object.assign({}, this.dataList, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: AssetsAssignmentHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.assignation); //assignment
  }

}
