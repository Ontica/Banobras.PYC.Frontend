/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Assertion } from '../general/assertion';

import { HttpHandler } from './http-handler';
import { Service, HttpMethod } from './common-types';

@Injectable()
export class DirectoryService {

  private servicesList: Observable<Service[]>;


  constructor(private httpHandler: HttpHandler) {
    this.servicesList = this.getServicesList();
  }


  getService(servicePathOrUID: string,
             method?: HttpMethod): Observable<Service> {
    Assertion.assertValue(servicePathOrUID, 'servicePathOrUID');

    if (servicePathOrUID.includes('http://') || servicePathOrUID.includes('https://')) {
      return of<Service>(undefined);
    } else {
      return this.getServiceFromList(servicePathOrUID, method);
    }
  }


  // Private methods


  private getServiceFromList(servicePathOrUID: string,
                             method: HttpMethod): Observable<Service> {
    let condition: (Service) => boolean;

    if (servicePathOrUID.includes('/')) {
      return of<Service>(undefined);

    } else if (!servicePathOrUID.includes('/') && (typeof method === 'undefined')) {
      condition = (service: Service) => (service.uid === servicePathOrUID);

    } else if (!servicePathOrUID.includes('/') && (typeof method !== 'undefined')) {
      condition = (service: Service) => (service.uid === servicePathOrUID &&
        service.method.toString() === HttpMethod[method]);

    } else {
      throw Assertion.assertNoReachThisCode('A findService condition handler is missing in code.');
    }

    return this.servicesList.pipe(map((x: Service[]) => {
      const filteredServices = x.filter((service) => condition(service));

      if (filteredServices.length === 0) {
        Assertion.assertNoReachThisCode(
          'There are no services that satisfy the supplied search condition.'
        );

      } else if (filteredServices.length > 1) {
        Assertion.assertNoReachThisCode(
          `There are defined ${filteredServices.length} services that satisfy the ` +
          'supplied search condition.'
        );

      } else {
        return filteredServices[0];
      }
    }));
  }


  private getServicesList(): Observable<Service[]> {
    return this.httpHandler.get<Service[]>('v1/system/service-directory');
  }

}
