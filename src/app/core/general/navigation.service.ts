/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { map } from 'rxjs';

import { Compression, CORRUPT_ROUTE_DATA_MESSAGE, EmpObservable } from '@app/core';


const ROUTE_PARAM_KEY = 'init_query';


@Injectable()
export class NavigationService {


  constructor(private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute) { }


  openNewWindowWithQueryParams<T>(data: T) {
    let url = this.location.prepareExternalUrl(this.router.url).split('?')[0];

    if (!!data) {
      const dataString = JSON.stringify(data);
      const compressedData = Compression.compress(dataString);
      const encodedData = encodeURIComponent(compressedData);
      url += `?${ROUTE_PARAM_KEY}=${encodedData}`;
    }

    window.open(url, '_blank');
  }


  getQueryParamsFromRoute<T>(): EmpObservable<T> {

    return new EmpObservable<T>(

      this.activatedRoute.queryParams.pipe(

        map(queryParams => {

          const encodedData = queryParams[ROUTE_PARAM_KEY];

          if (encodedData) {

            try {

              const compressedData = decodeURIComponent(encodedData);
              const dataString = Compression.decompress(compressedData);
              const data: T = JSON.parse(dataString);

              return data;

            } catch (error) {

              throw new Error(`${CORRUPT_ROUTE_DATA_MESSAGE} (DATA): ${encodedData}`);

            }

          } else {

            return null;

          }

        })

      )

    )

  }

}
