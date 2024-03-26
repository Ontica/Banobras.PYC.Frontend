/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { PERMISSION_NOT_REQUIRED, ROUTES_LIST } from '@app/main-layout';

import { ApplicationSettingsService } from './application-settings.service';

import { ApplicationSettings } from './application-settings';

import { LocalStorageService, StorageKeys } from './local-storage.service';

import { Assertion } from '../general/assertion';

import { Principal } from '../security/principal';

import { KeyValue } from '../data-types/key-value';

import { Identity, SessionToken } from '../security/security-types';

import { CORRUPT_LOCAL_STORAGE_MESSAGE } from '../errors/error-messages';


@Injectable()
export class SessionService {

  private principal: Principal = Principal.empty;

  private data: KeyValue[] = [];

  constructor(private appSettingsService: ApplicationSettingsService,
              private localStorage: LocalStorageService) {
    this.tryToRetrieveStoredPrincipalData();
  }


  getSettings(): Promise<ApplicationSettings> {
    return this.appSettingsService.getApplicationSettings();
  }


  getSessionToken(): SessionToken {
    return this.localStorage.get<SessionToken>(StorageKeys.sessionToken);
  }


  setSessionToken(sessionToken: SessionToken) {
    this.localStorage.set<SessionToken>(StorageKeys.sessionToken, sessionToken);
  }


  getPrincipal(): Principal {
    return this.principal;
  }


  setPrincipal(principal: Principal) {
    Assertion.assertValue(principal, 'principal');

    this.principal = principal;
    this.setPrincipalToLocalStorage();
  }


  clearSession() {
    this.principal = Principal.empty;
    this.localStorage.removeAll();
  }


  getData<T>(key: string): T {
    Assertion.assertValue(key, 'key');

    const index = this.data.findIndex((x) => x.key === key);

    if (index !== -1) {
      return this.data[index].value as T;
    } else {
      throw new Error(`'${key}' value is not defined in application session data.`);
    }
  }


  setData<T>(key: string, value: T): void {
    Assertion.assertValue(key, 'key');
    Assertion.assertValue(value, 'value');

    const index = this.data.findIndex((x) => x.key === key);

    if (index !== -1) {
      this.data[index] = { key, value };
    } else {
      this.data.push({ key, value });
    }
  }


  hasPermission(permission: string | string[]): boolean {
    if (typeof permission === 'string' && permission === PERMISSION_NOT_REQUIRED) {
      return true;
    }

    if (Array.isArray(permission)) {
      return this.principal.permissions &&
        this.principal.permissions.some(x => permission.some(y => y === x));
    }

    return this.principal.permissions && this.principal.permissions.some(x => x === permission);
  }


  getFirstValidRouteInModule(permission: string): string {
    const route = ROUTES_LIST.find(x => x.permission === permission);
    const routesInModule = ROUTES_LIST.filter(x => route?.parent === x.parent);
    const validRouteInModule = routesInModule.find(x => this.principal.permissions.includes(x.permission));

    if (!!validRouteInModule) {
      return validRouteInModule.fullpath;
    }

    return null;
  }


  private tryToRetrieveStoredPrincipalData() {
    try {
      this.setPrincipalFromLocalStorage();
    } catch (e) {
      this.clearSession();
      console.log(e);
    }
  }


  private setPrincipalFromLocalStorage() {
    const sessionToken = this.getSessionToken();

    if (!!sessionToken) {
      Assertion.assertValue(sessionToken.accessToken, 'sessionToken.accessToken');

      const identity = this.localStorage.get<Identity>(StorageKeys.identity) ?? null;
      const permissions = this.localStorage.get<string[]>(StorageKeys.permissions) ?? null;
      const defaultRoute = this.localStorage.get<string>(StorageKeys.defaultRoute) ?? null;

      Assertion.assert(identity && typeof identity.name === 'string',
        `${CORRUPT_LOCAL_STORAGE_MESSAGE}: ${StorageKeys.identity}`);
      Assertion.assert(permissions instanceof Array,
        `${CORRUPT_LOCAL_STORAGE_MESSAGE}: ${StorageKeys.permissions}`);
      Assertion.assert(typeof defaultRoute === 'string',
        `${CORRUPT_LOCAL_STORAGE_MESSAGE}: ${StorageKeys.defaultRoute}`);

      this.principal = new Principal(sessionToken, identity, permissions, defaultRoute);
    }
  }


  private setPrincipalToLocalStorage() {
    this.localStorage.set<SessionToken>(StorageKeys.sessionToken, this.principal.sessionToken);
    this.localStorage.set<Identity>(StorageKeys.identity, this.principal.identity);
    this.localStorage.set<string[]>(StorageKeys.permissions, this.principal.permissions);
    this.localStorage.set<string>(StorageKeys.defaultRoute, this.principal.defaultRoute);
  }

}
