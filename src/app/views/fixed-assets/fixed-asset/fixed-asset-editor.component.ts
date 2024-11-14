/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { FixedAsset, EmptyFixedAsset, BaseActions, EmptyBaseActions } from '@app/models';

import { FixedAssetHeaderEventType } from './fixed-asset-header.component';


export enum FixedAssetEditorEventType {
  UPDATED = 'FixedAssetEditorComponent.Event.FixedAssetUpdated',
  DELETED = 'FixedAssetEditorComponent.Event.FixedAssetDeleted',
}

@Component({
  selector: 'emp-pyc-fixed-asset-editor',
  templateUrl: './fixed-asset-editor.component.html',
})
export class FixedAssetEditorComponent {

  @Input() fixedAsset: FixedAsset = EmptyFixedAsset;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() fixedAssetEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.fixedAsset);
  }


  onFixedAssetHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FixedAssetHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
