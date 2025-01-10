/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { StringLibrary } from '@app/core';

import { environment } from 'src/environments/environment';


@Injectable()
export class UrlViewerService {

  constructor(private router: Router){}

  openWindowCentered(url: string, width: number = 900, height: number = 600) {
    if (StringLibrary.isValidHttpUrl(url)) {
      const top = Math.floor((screen.height / 2) - (height / 2));
      const left = Math.floor((screen.width / 2) - (width / 2));

      window.open(url, '_blank', `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
    }
  }


  openRouteInNewTab(route: string, queryParams) {
    const BASE_HREF = environment.production ? '/intranet/' : ''; // ToDo: Remove this hardcoded url fragment.

    const url = this.router.serializeUrl(this.router.createUrlTree([BASE_HREF + route], {queryParams}));
    window.open(url, '_blank');
  }

}
