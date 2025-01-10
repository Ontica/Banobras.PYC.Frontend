/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Exception, SessionService } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { NavigationHeader, DefaultNavigationHeader, buildNavigationHeader, Layout, View, DefaultView,
         ViewActionType } from '@app/main-layout/common-models';

import { APP_LAYOUTS, APP_VIEWS, LAYOUT_TYPE, TOOLS_LIST, DefaultTool,
         Tool } from '@app/main-layout/config-data';


export enum ActionType {
  SET_CURRENT_VIEW_FROM_URL = 'Empiria.UI-Item.MainUserInterface.SetCurrentViewFromUrl',
  SET_VIEW_ACTION           = 'Empiria.UI-Item.MainUserInterface.SetViewAction',
  SET_VIEW_ACTION_DEFAULT   = 'Empiria.UI-Item.MainUserInterface.SetViewActionDefault',
  SET_IS_PROCESSING_FLAG    = 'Empiria.UI-Item.MainUserInterface.SetIsProcessingFlag',
  SET_TOOL_SELECTED         = 'Empiria.UI-Item.MainUserInterface.SetToolSelected',
}


export enum SelectorType {
  LAYOUT              = 'Empiria.UI-Item.MainUserInterface.Layout',
  NAVIGATION_HEADER   = 'Empiria.UI-Item.MainUserInterface.NavigationHeader',
  CURRENT_VIEW        = 'Empiria.UI-Item.MainUserInterface.CurrentView',
  VIEW_ACTION         = 'Empiria.UI-Item.MainUserInterface.ViewAction',
  IS_PROCESSING       = 'Empiria.UI-Item.MainUserInterface.IsProcessing',
  TOOL_SELECTED       = 'Empiria.UI-Item.MainUserInterface.ToolSelected',
}


export interface MainLayoutState {
  readonly layout: Layout<LAYOUT_TYPE>;
  readonly navigationHeader: NavigationHeader;
  readonly currentView: View;
  readonly viewActionSelected: ViewActionType;
  readonly isProcessing: boolean;
  readonly toolSelected: Tool;
}


const initialState: StateValues = [
  { key: SelectorType.LAYOUT, value: APP_LAYOUTS[0] },
  { key: SelectorType.NAVIGATION_HEADER, value: DefaultNavigationHeader },
  { key: SelectorType.CURRENT_VIEW, value: DefaultView },
  { key: SelectorType.VIEW_ACTION, value: 'None' },
  { key: SelectorType.IS_PROCESSING, value: false },
  { key: SelectorType.TOOL_SELECTED, value: DefaultTool },
];


@Injectable()
export class MainLayoutPresentationHandler extends AbstractPresentationHandler {

  constructor(private session: SessionService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }


  get state(): MainLayoutState {
    return {
      layout: this.getValue(SelectorType.LAYOUT),
      navigationHeader: this.getValue(SelectorType.NAVIGATION_HEADER),
      currentView: this.getValue(SelectorType.CURRENT_VIEW),
      viewActionSelected: this.getValue(SelectorType.VIEW_ACTION),
      isProcessing: this.getValue(SelectorType.IS_PROCESSING),
      toolSelected: this.getValue(SelectorType.TOOL_SELECTED),
    };
  }


  dispatch(actionType: ActionType, payload?: any): void {
    switch (actionType) {

      case ActionType.SET_IS_PROCESSING_FLAG:
        Assertion.assert(typeof payload === 'boolean', `${actionType} payload must be a boolean value.`);

        this.setValue(SelectorType.IS_PROCESSING, payload);
        return;

      case ActionType.SET_CURRENT_VIEW_FROM_URL:
        Assertion.assertValue(payload.url, 'payload.url');

        this.setCurrentViewFromUrl(payload.url);
        return;

      case ActionType.SET_VIEW_ACTION:
        Assertion.assertValue(payload.action, 'payload.action');

        this.setValue(SelectorType.VIEW_ACTION, payload.action);
        return;

      case ActionType.SET_VIEW_ACTION_DEFAULT:
        this.setValue(SelectorType.VIEW_ACTION, 'None');
        return;

      case ActionType.SET_TOOL_SELECTED:
        Assertion.assert(TOOLS_LIST.includes(payload?.toolType),
          `${actionType} - ${payload?.toolType}: tool type must be valid.`);

        this.setValue(SelectorType.TOOL_SELECTED, payload);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }


  // private methods


  private getViewLayout(view: View): Layout<LAYOUT_TYPE> {
    for (const layout of APP_LAYOUTS) {
      if (layout.views.includes(view)) {
        return layout;
      }
    }
    throw Assertion.assertNoReachThisCode(`Unregistered view ${view.name}.`);
  }


  private setCurrentViewFromUrl(url: string) {
    if (this.state.currentView.url !== url) {
      const view = APP_VIEWS.find(x => x.url === url);

      if (!view) {
        throw new Exception(`Unregistered view with url '${url}'.`);
      }

      const viewLayout = this.getViewLayout(view);

      if (this.state.layout !== viewLayout) {
        this.setLayout(viewLayout);
      }

      this.setNavigationHeader(view);

      this.setValue(SelectorType.CURRENT_VIEW, view);
    }
  }


  private setLayout(value: Layout<LAYOUT_TYPE>) {
    if (this.state.layout !== value) {
      this.setValue(SelectorType.LAYOUT, value);
    }
  }


  private setNavigationHeader(value: NavigationHeader | View) {
    if (value && 'url' in value) {
      const layout = APP_LAYOUTS.find(x => x.name === this.state.layout.name);

      const navHeader = !layout ? DefaultNavigationHeader :
        buildNavigationHeader(layout, this.session.getPrincipal().permissions, value);

      this.setValue(SelectorType.NAVIGATION_HEADER, navHeader);

    } else if (value) {
      this.setValue(SelectorType.NAVIGATION_HEADER, value as NavigationHeader);
    }
  }

}
