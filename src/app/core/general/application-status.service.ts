/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable, OnDestroy } from '@angular/core';

import { of } from 'rxjs';

import { APP_CONFIG } from '@app/main-layout';

import { AppStatusStateSelector } from '@app/presentation/app-data/_app-data.presentation.types';

import { PresentationLayer, SubscriptionHelper } from '../presentation';

import { EmpObservable } from '../data-types';

@Injectable()
export class ApplicationStatusService implements OnDestroy {

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  canUserContinue(): EmpObservable<boolean> {
    if (APP_CONFIG.security.protectUserWork) {
      return this.subscriptionHelper.select<boolean>(AppStatusStateSelector.CAN_CLOSE_USER_WORK);
    }

    return new EmpObservable<boolean>(of(true));
  }

}
