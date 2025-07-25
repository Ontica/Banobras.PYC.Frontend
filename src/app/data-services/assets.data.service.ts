/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, AssetDescriptor, AssetHolder, AssetsQuery } from '@app/models';


@Injectable()
export class AssetsDataService {


  constructor(private http: HttpService) { }


  getAssetsTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/assets/types';

    return this.http.get<Identifiable[]>(path);
  }


  getAssetsConditions(): EmpObservable<Identifiable[]> {
    const path = 'v2/assets/conditions';

    return this.http.get<Identifiable[]>(path);
  }


  getAssetsRootLocations(): EmpObservable<Identifiable[]> {
    const path = 'v2/assets/locations/root';

    return this.http.get<Identifiable[]>(path);
  }


  getAssetsLocationsList(locationUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(locationUID, 'locationUID');

    const path = `v2/assets/locations/${locationUID}/children`;

    return this.http.get<Identifiable[]>(path);
  }


  searchAssets(query: AssetsQuery): EmpObservable<AssetDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/search';

    return this.http.post<AssetDescriptor[]>(path, query);
  }



  exportAssets(query: AssetsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/export';

    return this.http.post<FileReport>(path, query);
  }


  getAsset(assetUID: string): EmpObservable<AssetHolder> {
    Assertion.assertValue(assetUID, 'assetUID');

    const path = `v2/assets/${assetUID}`;

    return this.http.get<AssetHolder>(path);
  }

}
