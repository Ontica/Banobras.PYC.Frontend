/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { inject } from '@angular/core';

import { Router, ActivatedRouteSnapshot, CanActivateFn, CanActivateChildFn } from '@angular/router';

import { LOGIN_PATH, UNAUTHORIZED_PATH } from '@app/main-layout';

import { ApplicationStatusService } from '../general/application-status.service';

import { SessionService } from '../general/session.service';

import { RoutingStateService } from './routing-state.service';


export const ParentRouteGuard: CanActivateFn = () => isAuthenticated();


export const ChildRouteGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) => {
  if (!isAuthenticated()) {
    return false;
  }

  const isRoutingInicialized = inject(RoutingStateService).isInitialized;

  if (!isRouteProtected(route)) {
    return true;
  }

  const session = inject(SessionService);

  if (!session.hasPermission(route.data.permission)) {
    const firstValidRouteInModule = isRoutingInicialized ?
      session.getFirstValidRouteInModule(route.data.permission) : null;

    inject(Router).navigateByUrl(firstValidRouteInModule ?? UNAUTHORIZED_PATH);

    return false;
  }

  const userCanContinue = inject(ApplicationStatusService).canUserContinue();

  return userCanContinue;
};


const isAuthenticated = (): boolean => {
  if (!inject(SessionService).getPrincipal().isAuthenticated) {
    inject(Router).navigateByUrl(LOGIN_PATH);
    return false;
  }

  return true;
};


const isRouteProtected = (route: ActivatedRouteSnapshot): boolean => {
  return !!route.data.permission;
};
