/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FixedAssetDescriptor, FixedAssetHolder, FixedAssetsQuery } from '@app/models';


@Injectable()
export class FixedAssetsDataService {


  constructor(private http: HttpService) { }


  getFixedAssetTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/fixed-assets/types';

    return this.http.get<Identifiable[]>(path);
  }


  searchFixedAssets(query: FixedAssetsQuery): EmpObservable<FixedAssetDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/fixed-assets/search';

    return this.http.post<FixedAssetDescriptor[]>(path, query);
  }


  getFixedAsset(fixedAssetUID: string): EmpObservable<FixedAssetHolder> {
    Assertion.assertValue(fixedAssetUID, 'fixedAssetUID');

    const path = `v2/fixed-assets/${fixedAssetUID}`;

    return this.http.get<FixedAssetHolder>(path);
  }

}
