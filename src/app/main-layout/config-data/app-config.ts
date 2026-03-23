/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { environment } from 'src/environments/environment';

import { AppConfig } from '../common-models/common';

import { PRODUCT_PROFILE, PRODUCT_PROFILES } from './product-profiles-config';


const profile = PRODUCT_PROFILES[environment.productProfile] ?? PRODUCT_PROFILES['Full'];


export const APP_CONFIG: AppConfig<PRODUCT_PROFILE> = {
  data: {
    name: profile.name ?? 'Planeación y Control',
    nameShort: profile.nameShort ?? 'PYC',
    description: profile.description ?? '',
    hint: profile.hint ?? 'Secretaría de Hacienda y Crédito Público',
    organization: profile.organization ?? 'Banco Nacional de Obras y Servicios Públicos S.N.C.',
    organizationShort: profile.organizationShort ?? 'BANOBRAS',
  },
  security: {
    fakeLogin: false,
    enablePermissions: true,
    encriptLocalStorageData: true,
    protectUserWork: false,
  },
  layout: {
    displayLoginRight: false,
    displayLogo: true,
    displayNavbarHeader: true,
    displayNavbarHint: false,
    displayMenuUser: false,
    displayChangeLanguage: false,
    displayChangePassword: false,
    displaySubMenu: true,
    displayHeader: false,
    displayFooter: false,
  },
  versioning: {
    enableCheck: true,
    checkIntervalInMinutes: environment.production ? 10 : 0.15,
  },
  productProfile: profile ?? PRODUCT_PROFILES['Full'],
};
