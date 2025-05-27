/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialProjectHolder, EmptyFinancialProjectsQuery, FinancialProjectDescriptor,
         FinancialProjectHolder, FinancialProjectsQuery,
         mapFinancialProjectDescriptorFromProject } from '@app/models';

import { ProjectsExplorerEventType } from '../projects-explorer/projects-explorer.component';


@Component({
  selector: 'emp-cf-project-main-page',
  templateUrl: './projects-main-page.component.html',
})
export class FinancialProjectsMainPageComponent {

  query: FinancialProjectsQuery = Object.assign({}, EmptyFinancialProjectsQuery);

  dataList: FinancialProjectDescriptor[] = [];

  selectedData: FinancialProjectHolder = EmptyFinancialProjectHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private projectsData: FinancialProjectsDataService,
              private messageBox: MessageBoxService) { }


  onProjectsExplorerEvent(event: EventInfo) {
    switch (event.type as ProjectsExplorerEventType) {
      case ProjectsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        this.messageBox.showInDevelopment('Agregar proyecto');
        return;
      case ProjectsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FinancialProjectsQuery);
        this.searchProjects(this.query);
        return;
      case ProjectsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FinancialProjectsQuery);
        return;
      case ProjectsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      case ProjectsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Seleccionar proyecto', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchProjects(query: FinancialProjectsQuery) {
    this.isLoading = true;

    this.projectsData.searchProjects(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private resolveGetProject(data: FinancialProjectHolder, refresh: boolean = false) {
    this.setSelectedData(data);

    if (refresh) {
      this.insertItemToList(data);
    }
  }


  private setQueryAndClearExplorerData(query: FinancialProjectsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyFinancialProjectHolder);
  }


  private setDataList(data: FinancialProjectDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FinancialProjectHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.project);
  }


  private refreshSelectedData(dataUID: string) {

  }


  private insertItemToList(data: FinancialProjectHolder) {
    const dataToInsert = mapFinancialProjectDescriptorFromProject(data.project);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== dataUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyFinancialProjectHolder);
  }

}
