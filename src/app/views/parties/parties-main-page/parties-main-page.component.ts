/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/services';

import { PartiesDataService } from '@app/data-services';

import { DataTableColumn, DefaultPartiesColumns, DefaultSuppliersColumns, EmptyPartiesDataTable,
         EmptyPartiesQuery, EmptyPartyExplorerTypeConfig, ExplorerTypeConfig, getPartyExplorerTypeConfig,
         PartiesDataTable, PartiesQuery, PartyDescriptor, PartyObjectTypes } from '@app/models';

import {
  PartiesExplorerEventType
} from '@app/views/parties/parties-explorer/parties-explorer.component';


@Component({
  selector: 'emp-ng-parties-main-page',
  templateUrl: './parties-main-page.component.html',
})
export class PartiesMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  query: PartiesQuery = Object.assign({}, EmptyPartiesQuery);

  data: PartiesDataTable = Object.assign({}, EmptyPartiesDataTable);

  isLoading = false;

  queryExecuted = false;

  constructor(private uiLayer: PresentationLayer,
              private partiesData: PartiesDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToCurrentViewChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onPartiesExplorerEvent(event: EventInfo) {
    switch (event.type as PartiesExplorerEventType) {
      case PartiesExplorerEventType.CREATE_CLICKED:
        this.messageBox.showInDevelopment('Agregar ' + this.config.nameSingular.toLowerCase());
        return;
      case PartiesExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PartiesQuery);
        this.validateSearchParties();
        return;
      case PartiesExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PartiesQuery);
        return;
      case PartiesExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccionar ' + this.config.nameSingular.toLowerCase(),
          event.payload.entry);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setExplorerConfigFromCurrentView(x));
  }


  private setExplorerConfigFromCurrentView(view: View) {
    switch (view.name) {
      case 'Payments.Suppliers':
        this.config = getPartyExplorerTypeConfig(PartyObjectTypes.SUPPLIER)
        break;
      case 'SystemManagementViews.OrganizationalUnits':
        this.config = getPartyExplorerTypeConfig(PartyObjectTypes.ORGANIZATIONAL_UNITS)
        break;
      default:
        this.config = getPartyExplorerTypeConfig(null);
        break;
    }

    this.setDataColumns();
  }


  private validateSearchParties() {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        this.searchParties(this.query);
        return;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
      default:
        this.messageBox.showInDevelopment('Buscar ' + this.config.namePlural.toLowerCase());
        return;
    }
  }


  private searchParties(query: PartiesQuery) {
    this.isLoading = true;

    this.partiesData.searchParties(query)
      .firstValue()
      .then(x => this.setData(x, true))
      .finally(() => this.isLoading = false);
  }


  private setQueryAndClearExplorerData(query: PartiesQuery) {
    this.query = Object.assign({}, query);
    this.setData([], false);
  }


  private setDataColumns() {
    const columns = this.getDataColumnsByConfig();
    this.data = Object.assign({}, this.data, { columns });
  }


  private setData(data: PartyDescriptor[], queryExecuted: boolean = true) {
    this.data = Object.assign({}, this.data, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }


  private getDataColumnsByConfig(): DataTableColumn[] {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        return DefaultSuppliersColumns;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
      default:
        return DefaultPartiesColumns;
    }
  }

}
