/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

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

  requestDataList: RequestDescriptor[] = [];

  selectedRequest: RequestData = EmptyRequestData;

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
    this.setRequestsListFromCurrentView();
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
        this.resetExplorerData(event.payload.request as RequestData);
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
        Assertion.assertValue(event.payload.command, 'event.payload.command');
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
        this.clearSelectedRequest();
        return;

      case RequestTabbedViewEventType.REQUEST_UPDATED:
        Assertion.assertValue(event.payload.request, 'event.payload.request');
        this.resetExplorerData(event.payload.request as RequestData);
        return;

      case RequestTabbedViewEventType.REQUEST_DELETED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        this.removeRequestFromRequestDataList(event.payload.requestUID);
        this.clearSelectedRequest();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setRequestsListFromCurrentView() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW).subscribe(x => this.onCurrentViewChanged(x));
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'Budget.Requests':
        this.requestsList = RequestsList.budgeting;
        return;

      case 'Payments.Requests':
        this.requestsList = RequestsList.payments;
        return;

      default:
        this.requestsList = null;
        return;
    }
  }


  private searchRequests(query: RequestQuery) {
    this.isLoading = true;

    this.requestService.searchRequests(query)
      .firstValue()
      .then(x => this.resolveSearchRequests(x))
      .finally(() => this.isLoading = false);
  }


  private getRequest(requestUID: string) {
    this.isLoadingSelection = true;

    this.requestService.getRequest(requestUID)
      .firstValue()
      .then(x => this.setSelectedRequest(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveSearchRequests(data: RequestDescriptor[]) {
    this.setRequestDataList(data, true);
  }


  private resetExplorerData(request: RequestData) {
    this.addRequestToRequestDataList(request);
    this.setSelectedRequest(request);
  }


  private setQueryAndClearExplorerData(query: RequestQuery) {
    this.query = Object.assign({}, query);
    this.clearRequestDataList();
    this.clearSelectedRequest();
  }


  private addRequestToRequestDataList(data: RequestData) {
    const newRequest = mapRequestDescriptorFromRequest(data.request);
    const newRequestDataList = ArrayLibrary.insertItemTop(this.requestDataList, newRequest, 'uid');
    this.setRequestDataList(newRequestDataList, true);
  }


  private removeRequestFromRequestDataList(requestUID: string) {
    const data = this.requestDataList.filter(x => x.uid !== requestUID);
    this.setRequestDataList(data, true);
  }


  private setRequestDataList(data: RequestDescriptor[], queryExecuted: boolean = true) {
    this.requestDataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private clearRequestDataList() {
    this.setRequestDataList([], false);
  }


  private setSelectedRequest(data: RequestData) {
    this.selectedRequest = data;
    this.displayTabbedView = !isEmpty(this.selectedRequest.request);
  }


  private clearSelectedRequest() {
    this.setSelectedRequest(EmptyRequestData);
  }

}
