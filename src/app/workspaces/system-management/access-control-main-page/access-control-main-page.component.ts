/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { EmptyAccessControlSelectionData, AccessControlSelectionData } from '@app/models';

import {
  AccessControlTabbedViewEventType
} from '@app/views/_access-control/access-control-tabbed-view/access-control-tabbed-view.component';

import {
  AccessControlViewerComponent,
  AccessControlViewerEventType
} from '@app/views/_access-control/access-control-viewer/access-control-viewer.component';

@Component({
  selector: 'emp-ng-access-control-main-page',
  templateUrl: './access-control-main-page.component.html',
})
export class AccessControlMainPageComponent {

  @ViewChild('accessControlViewer') accessControlViewer: AccessControlViewerComponent;

  displayTabbedView = false;

  selectedData: AccessControlSelectionData = EmptyAccessControlSelectionData;

  onAccessControlViewerEvent(event: EventInfo) {
    switch (event.type as AccessControlViewerEventType) {

      case AccessControlViewerEventType.ITEM_SELECTED:
        Assertion.assertValue(event.payload, 'event.payload');
        this.setSelectedData(event.payload as AccessControlSelectionData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccessControlTabbedViewEvent(event: EventInfo) {
    switch (event.type as AccessControlTabbedViewEventType) {

      case AccessControlTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAccessControlSelectionData);
        return;

      case AccessControlTabbedViewEventType.DELETED:
        this.resetDataUpdated(EmptyAccessControlSelectionData);
        return;

      case AccessControlTabbedViewEventType.UPDATED:
        Assertion.assertValue(event.payload.subject, 'event.payload.subject');

        const data: AccessControlSelectionData = {
          type: this.selectedData.type,
          item: event.payload.subject,
        };

        this.resetDataUpdated(data);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetDataUpdated(data: AccessControlSelectionData) {
    this.setSelectedData(data);
    this.accessControlViewer.reloadData();
  }


  private setSelectedData(data: AccessControlSelectionData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.item);
  }

}
