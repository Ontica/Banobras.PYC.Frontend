/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AppAlertsPresentationHandler, AppAlertsStateAction } from '../presentation/presentation-types';



@Injectable()
export class ApplicationAlertsService {


  constructor(private appAlertsHandler: AppAlertsPresentationHandler) { }


  handleOutdatedApp() {
    this.appAlertsHandler.dispatch(AppAlertsStateAction.ADD_ALERT_OUTDATED);
  }

}
