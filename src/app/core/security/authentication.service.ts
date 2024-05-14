/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { APP_CONFIG, DEFAULT_ROUTE, DEFAULT_PATH, getAllPermissions, ROUTES_LIST,
         UNAUTHORIZED_PATH } from '@app/main-layout';

import { ACCESS_PROBLEM_MESSAGE, INVALID_CREDENTIALS_MESSAGE,
         NOT_ACTIVE_CREDENTIALS_MESSAGE } from '../errors/error-messages';

import { Assertion } from '../general/assertion';

import { SessionService } from '../general/session.service';

import { SecurityDataService } from './security-data.service';

import { resolve } from '../data-types';

import { Principal } from './principal';

import { FakeSessionToken, LoginErrorAction, LoginErrorActionType, LoginErrorType, PrincipalData,
         SessionToken, getFakePrincipalData } from './security-types';

import { PresentationState } from '../presentation';


@Injectable()
export class AuthenticationService {

  constructor(private store: PresentationState,
              private session: SessionService,
              private securityService: SecurityDataService) { }


  clearSession() {
    this.session.clearSession();
    this.store.clearValues();
  }


  async login(userID: string, userPassword: string): Promise<string> {
    Assertion.assertValue(userID, 'userID');
    Assertion.assertValue(userPassword, 'userPassword');

    const sessionToken = await this.createLoginSession(userID, userPassword)
      .then(x => {
        this.session.setSessionToken(x);
        return x;
      })
      .catch((e) => this.handleAuthenticationError(e));

    const principal = this.getPrincipal(userID);

    return Promise.all([sessionToken, principal])
      .then(([x, y]) => {
        this.setSession(x, y);
        return this.session.getPrincipal().defaultRoute;
      })
      .catch((e) => this.handleAuthenticationError(e));
  }


  async changePassword(userID: string,
                       currentPassword: string,
                       newPassword: string): Promise<void> {
    Assertion.assertValue(userID, 'userID');
    Assertion.assertValue(currentPassword, 'currentPassword');
    Assertion.assertValue(newPassword, 'newPassword');

    return this.createChangePasswordSession(userID, currentPassword, newPassword);
  }


  async logout(): Promise<boolean> {
    if (!this.session.getPrincipal().isAuthenticated) {
      this.session.clearSession();
      return Promise.resolve(false);
    }

    return this.closeSession()
      .then(() => Promise.resolve(true))
      .finally(() => this.session.clearSession());
  }


  private async createLoginSession(userID: string,
                                   userPassword: string): Promise<SessionToken> {
    return APP_CONFIG.security.fakeLogin ? resolve(FakeSessionToken) :
      this.securityService.createLoginSession(userID, userPassword);
  }


  private async getPrincipal(userID: string): Promise<PrincipalData> {
    return APP_CONFIG.security.fakeLogin ? resolve(getFakePrincipalData(userID)) :
      this.securityService.getPrincipalData();
  }


  private async createChangePasswordSession(userID: string,
                                            currentPassword: string,
                                            newPassword: string): Promise<void> {
    return APP_CONFIG.security.fakeLogin ? resolve(null) :
      this.securityService.changePassword(userID, currentPassword, newPassword);
  }


  private async closeSession(): Promise<void> {
    return APP_CONFIG.security.fakeLogin ? resolve(null) : this.securityService.closeSession();
  }


  private async handleAuthenticationError(error): Promise<any> {
    if (error.status === 401) {

      if ([LoginErrorType.MustChangePassword,
           LoginErrorType.UserPasswordExpired].includes(error.error.code)) {

        return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.ChangePassword,
          NOT_ACTIVE_CREDENTIALS_MESSAGE));

      }

      return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.None,
        INVALID_CREDENTIALS_MESSAGE));

    } else {

      return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.None,
        `${ACCESS_PROBLEM_MESSAGE}: ${error.status} ${error.statusText} ${error.message}`));

    }
  }


  private setSession(sessionToken: SessionToken, principalData: PrincipalData){
    if (!APP_CONFIG.security.enablePermissions) {
      principalData.permissions = getAllPermissions();
    }

    const defaultRoute = this.getDefaultRoute(principalData.permissions);

    const principal = new Principal(sessionToken,
                                    principalData.identity,
                                    principalData.permissions,
                                    defaultRoute);

    this.session.setPrincipal(principal);
  }


  private getLoginErrorAction(actionType: LoginErrorActionType, message: string) {
    const loginErrorAction: LoginErrorAction = {
      actionType,
      message
    };

    return loginErrorAction;
  }


  private getDefaultRoute(permissions: string[]): string {
    if (permissions.includes(DEFAULT_ROUTE.permission)) {
      return DEFAULT_PATH;
    }

    const firstRouteValid = this.getFirstRouteValid(permissions);

    if (!!firstRouteValid) {
      for (const route of ROUTES_LIST) {
        if (route.permission === firstRouteValid) {
          return route.fullpath;
        }
      }
    }

    return UNAUTHORIZED_PATH;
  }


  private getFirstRouteValid(permissions: string[]): string {
    if (!permissions) {
      return null;
    }

    return permissions.find(x => x.startsWith('route-')) ?? null;
  }

}
