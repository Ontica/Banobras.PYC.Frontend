/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { Asset, EmptyAsset, BaseActions, EmptyBaseActions } from '@app/models';

import { AssetHeaderEventType } from './asset-header.component';


export enum AssetEditorEventType {
  UPDATED = 'AssetEditorComponent.Event.AssetUpdated',
  DELETED = 'AssetEditorComponent.Event.AssetDeleted',
}

@Component({
  selector: 'emp-inv-asset-editor',
  templateUrl: './asset-editor.component.html',
})
export class AssetEditorComponent {

  @Input() asset: Asset = EmptyAsset;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() assetEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.asset);
  }


  onAssetHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as AssetHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
