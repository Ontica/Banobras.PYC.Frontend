/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { ApplicationSettings } from './application-settings';

import { KeyValue } from '../data-types/key-value';


@Injectable()
export class ApplicationSettingsService {

  private settings: Promise<ApplicationSettings>;

  constructor(private http: HttpClient) {
    this.loadData();
  }


  getApplicationSettings(): Promise<ApplicationSettings> {
    return this.settings;
  }


  private loadData() {
    if (this.settings) {
      return;
    }

    this.settings = firstValueFrom(this.http.get('./assets/empiria.config.json'))
                      .then((response: {settings: KeyValue[]}) => {
                        const data = response.settings;

                        return new ApplicationSettings(data);
                      });
  }

}
