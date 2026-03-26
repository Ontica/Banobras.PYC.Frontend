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

  alerts = [];


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
    return this.alerts.filter(x => x.persistent)?.length > 0;
  }


  onAlertClicked(alert: AppAlert) {
    if (alert.type === 'VersionUpdate') {
      this.notifyNewVersionAvailable(alert);
    }

    this.store.dispatch(AppAlertsStateAction.MARK_ALERT_AS_READ, { alertId: alert.id });
  }


  private validateSetAlertsAndNotify(alerts: AppAlert[]) {
    const hasVersionUpdateAlert = alerts.some(alert => this.isVersionUpdateAlert(alert));
    const versionUpdateAlert = alerts.find(alert => this.isVersionUpdateAlert(alert));

    if (hasVersionUpdateAlert && !versionUpdateAlert.read) {
      this.store.dispatch(AppAlertsStateAction.MARK_ALERT_AS_READ, { alertId: versionUpdateAlert.id });
      this.notifyNewVersionAvailable(versionUpdateAlert);
    }

    this.setAlerts(alerts)
  }


  private setAlerts(alerts: AppAlert[]) {
    this.alerts = [...alerts];
  }


  private isVersionUpdateAlert(alert: AppAlert): boolean {
    return alert.type === 'VersionUpdate';
  }


  private notifyNewVersionAvailable(alert: AppAlert) {
    if (this.messageBox.isOpen()) {
      return;
    }

    this.messageBox.confirm(alert.details ?? alert.message, alert.title, 'AcceptCancel', 'Refrescar')
      .firstValue()
      .then(x => x ? window.location.reload() : null);
  }

}
