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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { RequestsDataService } from '@app/data-services';

import { EmptyRequestData, EmptyRequestQuery, RequestData, RequestQuery, RequestsList,
         EmptyRequest, Request } from '@app/models/requests';

import { RequestsExplorerEventType } from '../requests-explorer/requests-explorer.component';

import { RequestCreatorEventType } from '../request/request-creator.component';


@Component({
  selector: 'emp-pyc-requests-main-page',
  templateUrl: './requests-main-page.component.html',
})
export class RequestsMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  requestsList: RequestsList = RequestsList.budgeting;

  query: RequestQuery = Object.assign({}, EmptyRequestQuery);

  requestData: RequestData = Object.assign({}, EmptyRequestData);

  requestSelected: Request = EmptyRequest;

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
        this.setRequestSelected(event.payload.request as Request);
        this.validateQueryForRefreshRequestData(this.requestSelected.organizationalUnit?.uid ?? '123',
                                                this.requestSelected.requestType?.uid ?? '123');
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
        this.clearRequestSelected();
        this.searchRequestData(this.query);
        return;

      case RequestsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query as RequestQuery);
        this.clearRequestsData();
        this.clearRequestSelected();
        return;

      case RequestsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccion de solicitud', event.payload.entry);
        return;

      case RequestsExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar solicitudes', this.query);
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


  private validateQueryForRefreshRequestData(organizationalUnitUID: string, requestTypeUID: string) {
    this.query = Object.assign({}, EmptyRequestQuery, { organizationalUnitUID, requestTypeUID });
    this.refreshRequestData();
  }


  private refreshRequestData() {
    this.searchRequestData(this.query);
  }


  private searchRequestData(query: RequestQuery) {
    this.isLoading = true;

    this.requestService.searchRequests(query)
      .firstValue()
      .then(x => this.resolveSearchRequestData(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchRequestData(data: RequestData) {
    this.setRequestData(data, true);
  }


  private setRequestData(data: RequestData, queryExecuted: boolean = true) {
    this.requestData = data?.columns ? data : Object.assign({}, EmptyRequestData);
    this.queryExecuted = queryExecuted;
  }


  private clearRequestsData() {
    this.setRequestData(EmptyRequestData, false);
  }


  private setRequestSelected(data: Request) {
    this.requestSelected = data;
    this.displayTabbedView = !isEmpty(this.requestSelected);
  }


  private clearRequestSelected() {
    this.setRequestSelected(EmptyRequest);
  }

}
