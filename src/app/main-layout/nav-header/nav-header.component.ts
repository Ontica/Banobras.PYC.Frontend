/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PresentationState } from '@app/core/presentation';

import { MainUIStateAction, MainUIStateSelector } from '@app/core/presentation/presentation-types';

import { MenuItem, NavigationHeader, ViewAction } from '../common-models';

import { APP_CONFIG } from '../config-data';


@Component({
  selector: 'emp-ng-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavigationHeaderComponent implements OnInit, OnDestroy {

  @Output() action = new EventEmitter<string>();

  navigationHeader: NavigationHeader;

  private subscription: Subscription;

  appLayoutConfig = APP_CONFIG.layout;

  constructor(protected state: PresentationState) { }


  ngOnInit() {
    this.subscription = this.state.select<NavigationHeader>(MainUIStateSelector.NAVIGATION_HEADER)
      .subscribe(
        value => this.navigationHeader = value
      );
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  onClickMenu(menuItem: MenuItem) {
    this.action.emit(menuItem.action);
  }


  onActionButtonClicked(action: ViewAction) {
    this.state.dispatch(MainUIStateAction.SET_VIEW_ACTION, action);
  }

}
