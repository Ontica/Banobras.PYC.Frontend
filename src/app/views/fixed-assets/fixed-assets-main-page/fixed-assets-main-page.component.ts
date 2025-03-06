/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { AssetsDataService } from '@app/data-services';

import { EmptyAssetHolder, EmptyAssetsQuery, AssetDescriptor, AssetHolder,
         AssetsQuery } from '@app/models';

import { FixedAssetsExplorerEventType } from '../fixed-assets-explorer/fixed-assets-explorer.component';

import { FixedAssetTabbedViewEventType } from '../fixed-asset-tabbed-view/fixed-asset-tabbed-view.component';


@Component({
  selector: 'emp-pyc-fixed-assets-main-page',
  templateUrl: './fixed-assets-main-page.component.html',
})
export class FixedAssetsMainPageComponent {

  query: AssetsQuery = Object.assign({}, EmptyAssetsQuery);

  dataList: AssetDescriptor[] = [];

  selectedData: AssetHolder = EmptyAssetHolder;

  displayTabbedView = false;

  fileUrl = '';

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private assetsData: AssetsDataService,
              private messageBox: MessageBoxService) { }


  onFixedAssetsExplorerEvent(event: EventInfo) {
    switch (event.type as FixedAssetsExplorerEventType) {
      case FixedAssetsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsQuery);
        this.searchAssets(this.query);
        return;
      case FixedAssetsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsQuery);
        return;
      case FixedAssetsExplorerEventType.EXPORT_CLICKED:
        this.exportAssets(this.query);
        return;
      case FixedAssetsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getAsset(event.payload.item.uid);
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
        this.setSelectedData(EmptyAssetHolder);
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


  private searchAssets(query: AssetsQuery) {
    this.isLoading = true;

    this.assetsData.searchAssets(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private exportAssets(query: AssetsQuery) {
    this.assetsData.exportAssets(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private getAsset(assetUID: string) {
    this.isLoadingSelection = true;

    this.assetsData.getAsset(assetUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(assetUID: string) {
    this.getAsset(assetUID);
  }


  private setQueryAndClearExplorerData(query: AssetsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyAssetHolder);
  }


  private setDataList(data: AssetDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: AssetHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.asset);
  }

}
