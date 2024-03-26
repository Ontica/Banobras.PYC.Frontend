/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ControlPanelOption, ControlPanelOptionList } from './control-panel-config';


@Component({
  selector: 'emp-ng-control-panel-main-page',
  templateUrl: './control-panel-main-page.component.html',
})
export class ControlPanelMainPageComponent {

  displayChangePasswordModal = false;

  controlPanelOptionList = ControlPanelOptionList;

  constructor(private messageBox: MessageBoxService) {}


  onClickControlPanelOption(option: ControlPanelOption) {
    switch (option.type) {

      case 'ChangePassword':
        this.displayChangePasswordModal = true;
        return;

      default:
        this.messageBox.showInDevelopment(option.title, option)
        return;

    }

  }

}
