/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { RequestsDataService } from '@app/data-services';

import { EmptyRequestData, EmptyRequestQuery, RequestData, RequestEntry, RequestQuery,
         ProcessGroup } from '@app/models/requests';

import { RequestsExplorerEventType } from '../requests-explorer/requests-explorer.component';


@Component({
  selector: 'emp-pyc-requests-main-page',
  templateUrl: './requests-main-page.component.html',
})
export class RequestsMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  processGroup: ProcessGroup = ProcessGroup.budgeting;

  query: RequestQuery = Object.assign({}, EmptyRequestQuery);

  data: RequestData = Object.assign({}, EmptyRequestData);

  entrySelected: RequestEntry = null;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private uiLayer: PresentationLayer,
              private requestData: RequestsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setProcessGroupFromCurrentView();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRequestsExplorerEvent(event: EventInfo) {
    switch (event.type as RequestsExplorerEventType) {
      case RequestsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;

      case RequestsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query);
        this.clearRequestsData();
        this.searchRequestData(this.query);
        return;

      case RequestsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query);
        this.clearRequestsData();
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


  private setProcessGroupFromCurrentView() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW).subscribe(x => this.onCurrentViewChanged(x));
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'Budget.Requests':
        this.processGroup = ProcessGroup.budgeting;
        return;

      case 'Payments.Requests':
        this.processGroup = ProcessGroup.payments;
        return;

      default:
        this.processGroup = null;
        return;
    }
  }


  private searchRequestData(query: RequestQuery) {
    this.isLoading = true;

    this.requestData.searchRequests(query)
      .firstValue()
      .then(x => this.setRequestData(x))
      .finally(() => this.isLoading = false);
  }


  private setRequestData(data: RequestData, queryExecuted: boolean = true) {
    this.data = data?.columns ? data : Object.assign({}, EmptyRequestData);
    this.queryExecuted = queryExecuted;
  }


  private clearRequestsData() {
    this.setRequestData(EmptyRequestData, false);
    this.entrySelected = null;
  }

}
