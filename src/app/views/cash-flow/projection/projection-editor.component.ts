/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { CashFlowProjectionsDataService } from '@app/data-services';

import { CashFlowProjection, CashFlowProjectionActions, CashFlowProjectionHolder, EmptyCashFlowProjection,
         EmptyCashFlowProjectionActions } from '@app/models';

import { ProjectionHeaderEventType } from './projection-header.component';


export enum ProjectionEditorEventType {
  UPDATED = 'CashFlowProjectionEditorComponent.Event.Updated',
  DELETED = 'CashFlowProjectionEditorComponent.Event.Deleted',
}

@Component({
  selector: 'emp-cf-projection-editor',
  templateUrl: './projection-editor.component.html',
})
export class CashFlowProjectionEditorComponent {

  @Input() projection: CashFlowProjection = EmptyCashFlowProjection;

  @Input() actions: CashFlowProjectionActions = EmptyCashFlowProjectionActions;

  @Output() projectionEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private projectionsData: CashFlowProjectionsDataService,
              private mesaggeBox: MessageBoxService) { }


  get isSaved(): boolean {
    return !isEmpty(this.projection);
  }


  @SkipIf('submitted')
  onProjectionHeaderEvent(event: EventInfo) {
    switch (event.type as ProjectionHeaderEventType) {
      case ProjectionHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.mesaggeBox.showInDevelopment('Actualizar proyección', event.payload);
        return;
      case ProjectionHeaderEventType.SEND_TO_AUTHORIZE:
        this.mesaggeBox.showInDevelopment('Enviar a autorizar proyección', event.payload);
        return;
      case ProjectionHeaderEventType.AUTHORIZE:
        this.mesaggeBox.showInDevelopment('Autorizar proyección', event.payload);
        return;
      case ProjectionHeaderEventType.REJECT:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.mesaggeBox.showInDevelopment('Rechazar proyección', event.payload);
        return;
      case ProjectionHeaderEventType.CLOSE:
        this.mesaggeBox.showInDevelopment('Cerrar proyección', event.payload);
        return;
      case ProjectionHeaderEventType.DELETE:
        this.mesaggeBox.showInDevelopment('Eliminar proyección', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resolveProjectionUpdated(data: CashFlowProjectionHolder) {
    sendEvent(this.projectionEditorEvent, ProjectionEditorEventType.UPDATED, { data });
  }


  private resolveProjectionDeleted(dataUID: string) {
    sendEvent(this.projectionEditorEvent, ProjectionEditorEventType.DELETED, { dataUID });
  }

}
