/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { EmptyRequestQuery, RequestQuery, RequestsList, RequestDescriptor, RequestData, EmptyRequestData,
         mapRequestDescriptorFromRequest } from '@app/models/requests';

import { RequestsExplorerEventType } from '../requests-explorer/requests-explorer.component';

import { RequestCreatorEventType } from '../request/request-creator.component';

import { RequestTabbedViewEventType } from '../request-tabbed-view/request-tabbed-view.component';


@Component({
  selector: 'emp-pyc-requests-main-page',
  templateUrl: './requests-main-page.component.html',
})
export class RequestsMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  requestsList: RequestsList = RequestsList.budgeting;

  query: RequestQuery = Object.assign({}, EmptyRequestQuery);

  dataList: RequestDescriptor[] = [];

  selectedData: RequestData = EmptyRequestData;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private uiLayer: PresentationLayer,
              private requestService: RequestsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToCurrentViewChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRequestCreatorEvent(event: EventInfo) {
    switch (event.type as RequestCreatorEventType) {
      case RequestCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case RequestCreatorEventType.REQUEST_CREATED:
        Assertion.assertValue(event.payload.request, 'event.payload.request');
        this.displayCreator = false;
        this.resolveRequestCreated(event.payload.request as RequestData);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestsExplorerEvent(event: EventInfo) {
    switch (event.type as RequestsExplorerEventType) {
      case RequestsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
      case RequestsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as RequestQuery);
        this.searchRequests(this.query);
        return;
      case RequestsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as RequestQuery);
        return;
      case RequestsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.request, ' event.payload.request');
        Assertion.assertValue(event.payload.request.uid, 'event.payload.request.uid');
        this.getRequest(event.payload.request.uid);
        return;
      case RequestsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload );
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestTabbedViewEvent(event: EventInfo) {
    switch (event.type as RequestTabbedViewEventType) {
      case RequestTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyRequestData);
        return;
      case RequestTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        this.refreshSelectedData(event.payload.requestUID);
        return;
      case RequestTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        this.removeItemFromList(event.payload.requestUID);
        return;
      case RequestTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        this.refreshSelectedData(event.payload.requestUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setRequestsListFromCurrentView(x));
  }


  private searchRequests(query: RequestQuery) {
    this.isLoading = true;

    this.requestService.searchRequests(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getRequest(requestUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.requestService.getRequest(requestUID)
      .firstValue()
      .then(x => this.resolveGetRequest(x, refresh))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveGetRequest(request: RequestData, refresh: boolean = false) {
    this.setSelectedData(request);

    if (refresh) {
      this.insertItemToList(request);
    }
  }


  private resolveRequestCreated(request: RequestData) {
    this.insertItemToList(request);
    this.setSelectedData(request);
  }


  private refreshSelectedData(requestUID: string) {
    this.getRequest(requestUID, true);
  }


  private removeItemFromList(requestUID: string) {
    const data = this.dataList.filter(x => x.uid !== requestUID);
    this.setDataList(data, true);
    this.setSelectedData(EmptyRequestData);
  }


  private setRequestsListFromCurrentView(newView: View) {
    switch (newView.name) {
      case 'Budget.Requests':
        this.requestsList = RequestsList.budgeting;
        return;
      case 'Payments.Requests':
        this.requestsList = RequestsList.payments;
        return;
      case 'Procurement.Requests':
        this.requestsList = RequestsList.contracts; // TODO: rename the requestslist to this module
        return;
      case 'Inventory.Requests':
        this.requestsList = RequestsList.assets; // TODO: rename the requestslist to this module
        return;
      default:
        this.requestsList = null;
        return;
    }
  }


  private setQueryAndClearExplorerData(query: RequestQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyRequestData);
  }


  private setDataList(data: RequestDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: RequestData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.request);
  }


  private insertItemToList(data: RequestData) {
    const dataToInsert = mapRequestDescriptorFromRequest(data.request);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew, true);
  }

}
