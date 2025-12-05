/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EmpObservable, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { ArrayLibrary } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { PartiesDataService } from '@app/data-services';

import { DataTableColumn, DefaultOrgUnitsColumns, DefaultPartiesColumns, DefaultSuppliersColumns,
         EmptyPartiesDataTable, EmptyPartiesQuery, EmptyPartyExplorerTypeConfig, EmptyPartyHolder,
         ExplorerTypeConfig, getPartyExplorerTypeConfig, mapOrgUnitDescriptorFromOrgUnit,
         mapPartyDescriptorFromParty, mapSupplierDescriptorFromSupplier, OrgUnitHolder, PartiesDataTable,
         PartiesQuery, PartyDescriptor, PartyHolder, PartyObjectTypes, SupplierHolder } from '@app/models';

import { SupplierCreatorEventType } from '../supplier/supplier-creator.component';

import {
  PartiesExplorerEventType
} from '@app/views/parties/parties-explorer/parties-explorer.component';

import { PartyTabbedViewEventType } from '../party-tabbed-view/party-tabbed-view.component';


@Component({
  selector: 'emp-ng-parties-main-page',
  templateUrl: './parties-main-page.component.html',
})
export class PartiesMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  query: PartiesQuery = Object.assign({}, EmptyPartiesQuery);

  data: PartiesDataTable = Object.assign({}, EmptyPartiesDataTable);

  selectedData: PartyHolder = EmptyPartyHolder;

  displayCreator = false;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

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


  get selectedDataUID(): string {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        return (this.selectedData as SupplierHolder)?.supplier?.uid ?? null;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        return (this.selectedData as OrgUnitHolder)?.organizationalUnit?.uid ?? null;
      default:
        return this.selectedData?.party?.uid ?? null;
    }
  }


  onPartyCreatorEvent(event: EventInfo) {
    switch (event.type as SupplierCreatorEventType) {
      case SupplierCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case SupplierCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as PartyHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPartiesExplorerEvent(event: EventInfo) {
    switch (event.type as PartiesExplorerEventType) {
      case PartiesExplorerEventType.CREATE_CLICKED:
        this.validateDisplayCreator();
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
        this.validateGetParty(event.payload.entry.uid);
        return;
      case PartiesExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar ' + this.config.namePlural.toLowerCase());
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPartyTabbedViewEvent(event: EventInfo) {
    switch (event.type as PartyTabbedViewEventType) {
      case PartyTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyPartyHolder, false);
        return;
      case PartyTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as PartyHolder);
        return;
      case PartyTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.removeItemFromList(event.payload.dataUID);
        return;
      case PartyTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.validateGetParty(event.payload.dataUID);
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
    let type = null

    switch (view.name) {
      case 'Payments.Suppliers':
        type = PartyObjectTypes.SUPPLIER;
        break;
      case 'SystemManagementViews.OrganizationalUnits':
        type = PartyObjectTypes.ORGANIZATIONAL_UNITS;
        break;
      default:
        break;
    }

    this.setConfig(type);
    this.setDataColumns();
  }


  private validateSearchParties() {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        this.executeSearchParties(this.partiesData.searchSuppliers(this.query));
        return;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        this.executeSearchParties(this.partiesData.searchOrgUnits(this.query));
        return;
      default:
        this.messageBox.showInDevelopment('Buscar ' + this.config.namePlural.toLowerCase());
        return;
    }
  }


  private validateGetParty(partyUID: string) {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        this.executeGetParty(this.partiesData.getSupplier(partyUID));
        return;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        this.executeGetParty(this.partiesData.getOrgUnit(partyUID));
        return;
      default:
        this.messageBox.showInDevelopment('Buscar ' + this.config.namePlural.toLowerCase());
        return;
    }
  }


  private executeSearchParties(observable: EmpObservable<PartyDescriptor[]>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.setData(x, true))
      .finally(() => this.isLoading = false);
  }


  private executeGetParty(observable: EmpObservable<PartyHolder>) {
    this.isLoadingSelection = true;

    observable
      .firstValue()
      .then(x => this.setSelectedData(x, true))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearExplorerData(query: PartiesQuery) {
    this.query = Object.assign({}, query);
    this.setData([], false);
    this.setSelectedData(EmptyPartyHolder, false);
  }


  private setConfig(type: PartyObjectTypes) {
    this.config = getPartyExplorerTypeConfig(type);
  }


  private setDataColumns() {
    const columns = this.getDataColumnsByConfig();
    this.data = Object.assign({}, this.data, { columns });
  }


  private getDataColumnsByConfig(): DataTableColumn[] {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        return DefaultSuppliersColumns;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        return DefaultOrgUnitsColumns;
      default:
        return DefaultPartiesColumns;
    }
  }


  private setData(data: PartyDescriptor[], queryExecuted: boolean = true) {
    this.data = Object.assign({}, this.data, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PartyHolder, display: boolean) {
    this.selectedData = data;
    this.displayTabbedView = display;
  }


  private insertItemToList(data: PartyHolder) {
    const dataToInsert = this.mapPartyDescriptorFromPartyType(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.data.entries, dataToInsert, 'uid');
    this.setData(dataListNew);
    this.setSelectedData(data, true);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.data.entries.filter(x => x.uid !== dataUID);
    this.setData(dataListNew);
    this.setSelectedData(EmptyPartyHolder, false);
  }


  private mapPartyDescriptorFromPartyType(data: PartyHolder): PartyDescriptor {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        return mapSupplierDescriptorFromSupplier(data as SupplierHolder);
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
        return mapOrgUnitDescriptorFromOrgUnit(data as OrgUnitHolder);
      default:
        return mapPartyDescriptorFromParty(data.party);
    }
  }


  private validateDisplayCreator() {
    switch (this.config.type) {
      case PartyObjectTypes.SUPPLIER:
        this.displayCreator = true;
        return;
      case PartyObjectTypes.ORGANIZATIONAL_UNITS:
      default:
        this.messageBox.showInDevelopment('Agregar ' + this.config.nameSingular.toLowerCase());
        return;
    }
  }

}
