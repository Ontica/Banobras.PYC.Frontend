/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AppAlert, getVersionUpdateAlert, getOutdatedVersionAlert } from '@app/data';


export enum ActionType {
  ADD_ALERT          = 'Empiria.UI-Flag.AppAlerts.AddAlert',
  ADD_ALERT_VERSION  = 'Empiria.UI-Flag.AppAlerts.AddAlertVersion',
  ADD_ALERT_OUTDATED = 'Empiria.UI-Flag.AppAlerts.AddAlertOutdated',
  MARK_ALERT_AS_READ = 'Empiria.UI-Flag.AppAlerts.MarkAlertAsRead',
  REMOVE_ALERT       = 'Empiria.UI-Flag.AppAlerts.RemoveAlert',
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
        const versionAlert = getVersionUpdateAlert();
        this.upsertAlert(versionAlert);
        return;

      case ActionType.ADD_ALERT_OUTDATED:
        const outdatedAlert = getOutdatedVersionAlert();
        this.upsertAlert(outdatedAlert);
        return;

      case ActionType.ADD_ALERT:
        this.upsertAlert(payload as AppAlert);
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
