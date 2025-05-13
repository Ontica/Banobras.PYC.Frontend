/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetHolder, AssetHolder, isEntityStatusInWarning } from '@app/models';

import { AssetEditorEventType } from '../asset/asset-editor.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum AssetTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AssetTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'AssetTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'AssetTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'AssetTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pyc-asset-tabbed-view',
  templateUrl: './asset-tabbed-view.component.html',
})
export class AssetTabbedViewComponent implements OnChanges {

  @Input() data: AssetHolder = EmptyAssetHolder;

  @Output() assetTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.assetTabbedViewEvent, AssetTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onAssetEditorEvent(event: EventInfo) {
    switch (event.type as AssetEditorEventType) {
      case AssetEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.assetUID, 'event.payload.assetUID');
        sendEvent(this.assetTabbedViewEvent,
          AssetTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case AssetEditorEventType.DELETED:
        Assertion.assertValue(event.payload.assetUID, 'event.payload.assetUID');
        sendEvent(this.assetTabbedViewEvent,
          AssetTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { assetUID: this.data.asset.uid };
        sendEvent(this.assetTabbedViewEvent, AssetTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const status = isEntityStatusInWarning(this.data.asset.status.name) ?
      `<span class="tag tag-error tag-small">${this.data.asset.status.name}</span>` :
      `<span class="tag tag-small">${this.data.asset.status.name}</span>`;

    this.title = `${this.data.asset.assetNo}: ${this.data.asset.name}` + status;

    this.hint = `<strong>${this.data.asset.assetType?.name ?? 'No determinado'} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${ this.data.asset.assignedTo?.name ?? 'No determinado'} (${this.data.asset.assignedToOrgUnit?.name ?? 'No determinado'}) &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.asset.locationName}`;
  }

}
