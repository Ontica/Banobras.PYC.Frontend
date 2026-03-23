/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Subscription, timer } from 'rxjs';

import { APP_CONFIG } from '@app/main-layout';

import { PresentationLayer } from '../presentation';

import { AppAlertsStateAction } from '../presentation/presentation-types';


interface AppVersionFile {
  version: string;
}


const VERSION_FILE_NAME = 'version.json';


@Injectable()
export class ApplicationVersionService implements OnDestroy {

  private initialized = false;

  private checkImmediately = false;

  private currentVersion: string = null;

  private subscription?: Subscription;



  constructor(private http: HttpClient,
              private uiLayer: PresentationLayer) { }


  ngOnDestroy() {
    this.stopPolling();
  }


  initialize() {
    if (this.initialized || !APP_CONFIG.versioning.enableCheck) {
      return;
    }

    this.initialized = true;
    this.loadCurrentVersion();
  }


  reset() {
    this.stopPolling();

    this.initialized = false;
    this.checkImmediately = true;
  }


  private loadCurrentVersion() {
    if (this.currentVersion) {
      this.startPolling();
      return;
    }

    this.http.get<AppVersionFile>(this.getVersionFileUrl())
      .subscribe({
        next: response => {
          this.currentVersion = response.version;
          this.startPolling();
        },
        error: () => {
          console.warn('Version file was not found. Version check has been disabled.');
        }
      });
  }


  private startPolling() {
    if (this.checkImmediately) {
      this.checkImmediately = false;
      this.checkLatestVersion();
    }

    const intervalInMs = APP_CONFIG.versioning.checkIntervalInMinutes * 60 * 1000;

    this.subscription = timer(intervalInMs, intervalInMs)
      .subscribe(() => this.checkLatestVersion());
  }


  private stopPolling() {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }


  private checkLatestVersion() {
    this.http.get<AppVersionFile>(`${this.getVersionFileUrl()}?t=${Date.now()}`)
      .subscribe({
        next: response => {
          if (this.currentVersion && response.version !== this.currentVersion) {
            this.publishVersionAlert(response.version);
            this.stopPolling();
          }
        },
        error: () => {
          console.warn('Version file could not be checked.');
          this.stopPolling();
        },
      });
  }


  private publishVersionAlert(latestVersion: string) {
    this.uiLayer.dispatch(AppAlertsStateAction.ADD_ALERT_VERSION, latestVersion);
  }


  private getVersionFileUrl(): string {
    return new URL(VERSION_FILE_NAME, document.baseURI).toString();
  }

}
