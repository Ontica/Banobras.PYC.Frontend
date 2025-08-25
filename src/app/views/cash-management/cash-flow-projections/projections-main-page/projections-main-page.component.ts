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

import { ProjectionCreatorEventType } from '../projection/projection-creator.component';

import { ProjectionsExplorerEventType } from '../projections-explorer/projections-explorer.component';

import { ProjectionTabbedViewEventType } from '../projection-tabbed-view/projection-tabbed-view.component';


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


  onProjectionCreatorEvent(event: EventInfo) {
    switch (event.type as ProjectionCreatorEventType) {
      case ProjectionCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case ProjectionCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.insertItemToList(event.payload.data as CashFlowProjectionHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectionsExplorerEvent(event: EventInfo) {
    switch (event.type as ProjectionsExplorerEventType) {
      case ProjectionsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
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
        this.getProjection(event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectionTabbedViewEvent(event: EventInfo) {
    switch (event.type as ProjectionTabbedViewEventType) {
      case ProjectionTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyCashFlowProjectionHolder);
        return;
      case ProjectionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as CashFlowProjectionHolder);
        return;
      case ProjectionTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.removeItemFromList(event.payload.dataUID);
        return;
      case ProjectionTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.refreshSelectedData(event.payload.dataUID);
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


  private getProjection(dataUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.projectionsData.getProjection(dataUID)
      .firstValue()
      .then(x => this.resolveGetProjection(x, refresh))
      .catch(e => this.setSelectedData(EmptyCashFlowProjectionHolder))
      .finally(() => this.isLoadingSelection = false);
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


  private refreshSelectedData(dataUID: string) {
    this.getProjection(dataUID, true);
  }


  private insertItemToList(data: CashFlowProjectionHolder) {
    const dataToInsert = mapCashFlowProjectionDescriptorFromProjection(data.projection);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== dataUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyCashFlowProjectionHolder);
  }

}
