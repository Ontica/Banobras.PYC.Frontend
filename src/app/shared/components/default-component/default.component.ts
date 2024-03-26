/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

@Component({
  selector: 'emp-ng-default',
  template: `

  <div class="explorer">

    <div class="primary">

      <div class="card card-border">

        <div class="card-header card-header-flat">

          <div class="card-title">
            {{viewName}}

            <div class="card-hint">
              Este componente esta en desarrollo.
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
  `
})
export class DefaultComponent implements OnInit, OnDestroy {

  viewName = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.viewName = x.title);
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }

}
