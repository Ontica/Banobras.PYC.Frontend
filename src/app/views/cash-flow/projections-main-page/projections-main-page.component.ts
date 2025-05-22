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

import { CashFlowProjectionsDataService } from '@app/data-services';

import { CashFlowProjectionDescriptor, CashFlowProjectionHolder, CashFlowProjectionsQuery,
         EmptyCashFlowProjectionHolder, EmptyCashFlowProjectionsQuery,
         mapCashFlowProjectionDescriptorFromProjection } from '@app/models';

import { ProjectionsExplorerEventType } from '../projections-explorer/projections-explorer.component';


@Component({
  selector: 'emp-cf-projections-main-page',
  templateUrl: './projections-main-page.component.html',
})
export class CashFlowProjectionsMainPageComponent {

  query: CashFlowProjectionsQuery = Object.assign({}, EmptyCashFlowProjectionsQuery);

  dataList: CashFlowProjectionDescriptor[] = [];

  selectedData: CashFlowProjectionHolder = EmptyCashFlowProjectionHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private projectionsData: CashFlowProjectionsDataService,
              private messageBox: MessageBoxService) { }


  onProjectionsExplorerEvent(event: EventInfo) {
    switch (event.type as ProjectionsExplorerEventType) {
      case ProjectionsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        this.messageBox.showInDevelopment('Agregar proyección', event.payload);
        return;
      case ProjectionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashFlowProjectionsQuery);
        this.searchProjections(this.query);
        return;
      case ProjectionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashFlowProjectionsQuery);
        return;
      case ProjectionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      case ProjectionsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Detalle de proyección', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchProjections(query: CashFlowProjectionsQuery) {
    this.isLoading = true;

    this.projectionsData.searchProjections(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private resolveGetProjection(data: CashFlowProjectionHolder, refresh: boolean = false) {
    this.setSelectedData(data);

    if (refresh) {
      this.insertItemToList(data);
    }
  }


  private setQueryAndClearExplorerData(query: CashFlowProjectionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyCashFlowProjectionHolder);
  }


  private setDataList(data: CashFlowProjectionDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: CashFlowProjectionHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.projection);
  }


  private refreshSelectedData(projectionUID: string) {

  }


  private insertItemToList(data: CashFlowProjectionHolder) {
    const dataToInsert = mapCashFlowProjectionDescriptorFromProjection(data.projection);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(projectionUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== projectionUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyCashFlowProjectionHolder);
  }

}
