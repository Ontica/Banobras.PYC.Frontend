/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, DateStringLibrary, EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AppAlert } from '@app/main-layout';


export enum ActionType {
  ADD_ALERT            = 'Empiria.UI-Flag.AppAlerts.AddAlert',
  ADD_ALERT_VERSION    = 'Empiria.UI-Flag.AppAlerts.AddAlertVersion',
  MARK_ALERT_AS_READ   = 'Empiria.UI-Flag.AppAlerts.MarkAlertAsRead',
  REMOVE_ALERT         = 'Empiria.UI-Flag.AppAlerts.RemoveAlert',
}


export enum SelectorType {
  ALERTS = 'Empiria.UI-Flag.AppAlerts.Alerts',
}


const initialState: StateValues = [
  { key: SelectorType.ALERTS, value: [] },
];


@Injectable()
export class AppAlertsPresentationHandler extends AbstractPresentationHandler {


  constructor() {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.ALERTS:
        return super.select<U>(selectorType);

      default:
        return super.select<U>(selectorType, params);

    }
  }


  dispatch(actionType: ActionType, payload?: any): void {
    switch (actionType) {

      case ActionType.ADD_ALERT_VERSION:
        this.addVersionAlert(payload as string);
        return;

      case ActionType.ADD_ALERT:
        this.addAlert(payload as AppAlert);
        return;

      case ActionType.MARK_ALERT_AS_READ:
        Assertion.assertValue(payload.alertId, 'payload.alertId');
        this.markAlertAsRead(payload.alertId as string);
        return;

      case ActionType.REMOVE_ALERT:
        this.removeAlert(payload as string);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }

  }


  private addVersionAlert(latestVersion?: string) {
    const alert: AppAlert = {
      id: 'version-update',
      type: 'VersionUpdate',
      title: 'Actualización disponible',
      message: 'Se detectó una nueva versión del sistema. ' +
               'Refresque la página para aplicar los cambios.',
      details: 'Se detectó una nueva versión del sistema. ' +
               'Refresque la página para aplicar los cambios. ' +
               'Si no visualiza nuevas opciones o accesos, cierre sesión e inicie sesión nuevamente.',
      dateTime: DateStringLibrary.today(),
      persistent: true,
      read: false,
    };

    this.upsertAlert(alert);
  }


  private addAlert(alert: AppAlert){
    this.upsertAlert(alert);
  }


  private markAlertAsRead(alertId: string): void {
    Assertion.assertValue(alertId, 'alertId');

    const alerts = this.getAlerts();

    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    );

    this.setValue(SelectorType.ALERTS, updatedAlerts);
  }


  private removeAlert(alertId: string): void {
    Assertion.assertValue(alertId, 'alertId');

    const alerts = this.getAlerts();
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);

    this.setValue(SelectorType.ALERTS, updatedAlerts);
  }


  private upsertAlert(alert: AppAlert): void {
    const alerts = this.getAlerts();
    const alertIndex = alerts.findIndex(x => x.id === alert.id);

    if (alertIndex === -1) {
      this.setValue(SelectorType.ALERTS, [...alerts, alert]);
      return;
    }

    const updatedAlerts = [...alerts];
    updatedAlerts[alertIndex] = {
      ...updatedAlerts[alertIndex],
      ...alert,
    };

    this.setValue(SelectorType.ALERTS, updatedAlerts);
  }


  private getAlerts(): AppAlert[] {
    const alerts = this.getValue <AppAlert[]>(SelectorType.ALERTS);
    return [...alerts] ?? [];
  }

}
