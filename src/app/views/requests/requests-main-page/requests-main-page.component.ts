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

import { EmptyRequestQuery, RequestQuery, RequestsList, RequestDescriptor,
         EmptyRequestDescriptor} from '@app/models/requests';

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

  requestsData: RequestDescriptor[] = [];

  selectedRequest: RequestDescriptor = EmptyRequestDescriptor;

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
        this.setSelectedRequest(event.payload.request);
        this.addRequestToRequestsData(this.selectedRequest);
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
        this.query = Object.assign({}, event.payload.query as RequestQuery);
        this.clearRequestsData();
        this.clearSelectedRequest();
        this.searchRequestsData(this.query);
        return;

      case RequestsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query as RequestQuery);
        this.clearRequestsData();
        this.clearSelectedRequest();
        return;

      case RequestsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.request, ' event.payload.request');
        this.setSelectedRequest(event.payload.request);
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


  private addRequestToRequestsData(request: RequestDescriptor) {
    const data = ArrayLibrary.insertIfNotExist(this.requestsData, request, 'uid');
    this.setRequestsData(data, true);
  }


  private searchRequestsData(query: RequestQuery) {
    this.isLoading = true;

    this.requestService.searchRequests(query)
      .firstValue()
      .then(x => this.resolveSearchRequestData(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchRequestData(data: RequestDescriptor[]) {
    this.setRequestsData(data, true);
  }


  private setRequestsData(data: RequestDescriptor[], queryExecuted: boolean = true) {
    this.requestsData = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private clearRequestsData() {
    this.setRequestsData([], false);
  }


  private setSelectedRequest(data: RequestDescriptor) {
    this.selectedRequest = data;
    this.displayTabbedView = !isEmpty(this.selectedRequest);
  }


  private clearSelectedRequest() {
    this.setSelectedRequest(EmptyRequestDescriptor);
  }

}
