/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FixedAssetsDataService } from '@app/data-services';

import { EmptyFixedAssetHolder, EmptyFixedAssetsQuery, FixedAssetDescriptor, FixedAssetHolder,
         FixedAssetsQuery } from '@app/models';

import { FixedAssetsExplorerEventType } from '../fixed-assets-explorer/fixed-assets-explorer.component';

import { FixedAssetTabbedViewEventType } from '../fixed-asset-tabbed-view/fixed-asset-tabbed-view.component';


@Component({
  selector: 'emp-pyc-fixed-assets-main-page',
  templateUrl: './fixed-assets-main-page.component.html',
})
export class FixedAssetsMainPageComponent {

  query: FixedAssetsQuery = Object.assign({}, EmptyFixedAssetsQuery);

  dataList: FixedAssetDescriptor[] = [];

  selectedData: FixedAssetHolder = EmptyFixedAssetHolder;

  displayTabbedView = false;

  fileUrl = '';

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private fixedAssetsData: FixedAssetsDataService,
    private messageBox: MessageBoxService) { }


  onFixedAssetsExplorerEvent(event: EventInfo) {
    switch (event.type as FixedAssetsExplorerEventType) {
      case FixedAssetsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FixedAssetsQuery);
        this.searchFixedAssets(this.query);
        return;
      case FixedAssetsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FixedAssetsQuery);
        return;
      case FixedAssetsExplorerEventType.EXPORT_CLICKED:
        this.exportTransactions(this.query);
        return;
      case FixedAssetsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getFixedAssetData(event.payload.item.uid);
        return;
      case FixedAssetsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFixedAssetTabbedViewEvent(event: EventInfo) {
    switch (event.type as FixedAssetTabbedViewEventType) {
      case FixedAssetTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyFixedAssetHolder);
        return;
      case FixedAssetTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.fixedAssetUID, 'event.payload.fixedAssetUID');
        this.refreshSelectedData(event.payload.fixedAssetUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchFixedAssets(query: FixedAssetsQuery) {
    this.isLoading = true;

    this.fixedAssetsData.searchFixedAssets(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private exportTransactions(query: FixedAssetsQuery) {
    this.fixedAssetsData.exportFixedAssets(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private getFixedAssetData(fixedAssetUID: string) {
    this.isLoadingSelection = true;

    this.fixedAssetsData.getFixedAsset(fixedAssetUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(fixedAssetUID: string) {
    this.getFixedAssetData(fixedAssetUID);
  }


  private setQueryAndClearExplorerData(query: FixedAssetsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyFixedAssetHolder);
  }


  private setDataList(data: FixedAssetDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FixedAssetHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.fixedAsset);
  }

}
