/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { AppAlert } from '@app/data';

import { PresentationState } from '@app/core/presentation';

import { AppAlertsStateAction, AppAlertsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';


@Component({
  selector: 'emp-ng-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {

  displayAlerts = true;

  alerts: AppAlert[] = [];


  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState,
              private messageBox: MessageBoxService) {}

  ngOnInit() {
    this.store.select<AppAlert[]>(AppAlertsStateSelector.ALERTS)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.validateSetAlertsAndNotify(x));
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }



  get hasAlerts(): boolean {
    return this.alerts.length > 0;
  }


  get displayPersistent(): boolean {
    return this.alerts.some(x => x.persistent);
  }


  onAlertClicked(alert: AppAlert) {
    if (this.requiresRefresh(alert)) {
      this.notifyRefreshRequired(alert);
    } else {
      this.notifyAlert(alert);
    }

    this.store.dispatch(AppAlertsStateAction.MARK_ALERT_AS_READ, { alertId: alert.id });
  }


  private validateSetAlertsAndNotify(alerts: AppAlert[]) {
    const appAlert = alerts.find(alert => this.requiresRefresh(alert));

    if (appAlert && !appAlert.read) {
      this.store.dispatch(AppAlertsStateAction.MARK_ALERT_AS_READ, { alertId: appAlert.id });
      this.validateNotifyRefresh(appAlert);
    }

    this.setAlerts(alerts)
  }


  private setAlerts(alerts: AppAlert[]) {
    this.alerts = [...alerts];
  }


  private requiresRefresh(alert: AppAlert): boolean {
    return ['VersionUpdate', 'OutdatedVersion'].includes(alert.type)
  }


  private validateNotifyRefresh(alert: AppAlert) {
    if (alert.refreshMandatory) {
      this.notifyRefreshMandatory(alert);
    } else {
      this.notifyRefreshRequired(alert);
    }
  }


  private notifyRefreshRequired(alert: AppAlert) {
    if (this.messageBox.isOpen()) {
      return;
    }

    this.messageBox.confirm(alert.details ?? alert.message, alert.title, 'AcceptCancel', 'Refrescar')
      .firstValue()
      .then(x => x ? window.location.reload() : null);
  }


  private notifyRefreshMandatory(alert: AppAlert) {
    this.messageBox.confirmError(alert.details ?? alert.message, alert.title, 'Refrescar')
      .firstValue()
      .then(x => x ? window.location.reload() : null);
  }


  private notifyAlert(alert: AppAlert) {
    if (this.messageBox.isOpen()) {
      return;
    }

    this.messageBox.show(alert.details ?? alert.message, alert.title);
  }

}
