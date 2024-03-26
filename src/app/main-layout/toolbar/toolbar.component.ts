/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { PresentationState } from '@app/core/presentation';

import { MainUIStateAction, MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PERMISSIONS, TOOL_TYPES, Tool } from '../config-data';


@Component({
  selector: 'emp-ng-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  permissions = PERMISSIONS;

  displayAsideRight = false;

  toolSelected: TOOL_TYPES = 'None';

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState,
              private messageBox: MessageBoxService) {}

  ngOnInit() {
    this.store.select<Tool>(MainUIStateSelector.TOOL_SELECTED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.setToolSelected(x));
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onToolClicked(toolType: TOOL_TYPES) {

    switch (toolType) {
      case 'Alerts':
      case 'Search':

        const tool: Tool = {
          toolType,
        };

        this.store.dispatch(MainUIStateAction.SET_TOOL_SELECTED, tool);
        return;

      default:
        return;
    }

  }


  private setToolSelected(tool: Tool) {
    this.toolSelected = tool.toolType;
    this.displayAsideRight = this.toolSelected !== 'None';
  }

}
