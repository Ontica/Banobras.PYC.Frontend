/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { PresentationState } from '@app/core/presentation';

import { MainUIStateAction } from '@app/presentation/exported.presentation.types';

import { ApplicationStatusService, AuthenticationService, SessionService } from '@app/core';

import { Principal } from '@app/core/security/principal';

import { APP_CONFIG, LOGIN_PATH } from '../config-data';


@Component({
  selector: 'emp-ng-user-session',
  templateUrl: './user-session.component.html',
  styleUrls: ['./user-session.component.scss']
})
export class UserSessionComponent implements OnInit {

  principal: Principal = Principal.empty;

  appLayoutConfig = APP_CONFIG.layout;


  constructor(private appStatus: ApplicationStatusService,
              private store: PresentationState,
              private session: SessionService,
              private authenticationService: AuthenticationService,
              private router: Router) {}

  ngOnInit(): void {
    this.principal = this.session.getPrincipal();
  }


  onLogoutClicked() {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? this.logout() : null
      );
  }


  private logout() {
    this.store.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, true);

    this.authenticationService.logout()
      .finally(() => {
        this.store.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, false);
        this.router.navigateByUrl(LOGIN_PATH);
      });
  }

}
