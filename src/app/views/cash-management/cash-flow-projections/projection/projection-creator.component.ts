/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { CashFlowProjectionsDataService } from '@app/data-services';

import { CashFlowProjectionFields } from '@app/models';

import { ProjectionHeaderEventType } from './projection-header.component';


export enum ProjectionCreatorEventType {
  CREATED             = 'CashFlowProjectionCreatorComponent.Event.Created',
  CLOSE_MODAL_CLICKED = 'CashFlowProjectionCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-cf-projection-creator',
  templateUrl: './projection-creator.component.html',
})
export class CashFlowProjectionCreatorComponent {

  @Output() projectionCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private projectionsData: CashFlowProjectionsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.projectionCreatorEvent, ProjectionCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onProjectionHeaderEvent(event: EventInfo) {
    switch (event.type as ProjectionHeaderEventType) {
      case ProjectionHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createProjection(event.payload.dataFields as CashFlowProjectionFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createProjection(dataFields: CashFlowProjectionFields) {
    this.submitted = true;

    this.projectionsData.createProjection(dataFields)
      .firstValue()
      .then(x => sendEvent(this.projectionCreatorEvent, ProjectionCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
