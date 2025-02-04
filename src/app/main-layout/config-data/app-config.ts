/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppConfig } from '../common-models/common';


export const APP_CONFIG: AppConfig = {
  data: {
    name: 'Planeación y Control',
    nameShort: 'PYC',
    hint: 'Secretaría de Hacienda y Crédito Público',
    organization: 'Banco Nacional de Obras y Servicios Públicos S.N.C.',
    organizationShort: 'BANOBRAS',
    description: '',
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
  }
};
