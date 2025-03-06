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

import { FixedAssetEditorEventType } from '../fixed-asset/fixed-asset-editor.component';

import {
  DocumentsEditionEventType
} from '@app/views/documents/documents-edition/documents-edition.component';


export enum FixedAssetTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FixedAssetTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'FixedAssetTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'FixedAssetTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'FixedAssetTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pyc-fixed-asset-tabbed-view',
  templateUrl: './fixed-asset-tabbed-view.component.html',
})
export class FixedAssetTabbedViewComponent implements OnChanges {

  @Input() data: AssetHolder = EmptyAssetHolder;

  @Output() fixedAssetTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.fixedAssetTabbedViewEvent, FixedAssetTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onFixedAssetEditorEvent(event: EventInfo) {
    switch (event.type as FixedAssetEditorEventType) {
      case FixedAssetEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.fixedAssetUID, 'event.payload.fixedAssetUID');
        sendEvent(this.fixedAssetTabbedViewEvent,
          FixedAssetTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case FixedAssetEditorEventType.DELETED:
        Assertion.assertValue(event.payload.fixedAssetUID, 'event.payload.fixedAssetUID');
        sendEvent(this.fixedAssetTabbedViewEvent,
          FixedAssetTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { fixedAssetUID: this.data.asset.uid };
        sendEvent(this.fixedAssetTabbedViewEvent, FixedAssetTabbedViewEventType.REFRESH_DATA, payload);
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
